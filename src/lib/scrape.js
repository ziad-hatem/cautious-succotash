const axios = require('axios');
const cheerio = require('cheerio');

// collapse inner spaces + trim
const clean = (s) => (s || "").replace(/\s+/g, " ").trim();

// remove a leading Arabic label word if present
const stripLabel = (text, label) =>
  clean(text.replace(new RegExp("^\\s*" + label + "\\s*"), ""));

const resolveUrl = (src, base) => {
  try {
    return new URL(src, base).toString();
  } catch {
    return src;
  }
};

async function fetchAndScrape(code, baseUrl) {
  try {
    // Post the search form data instead of GET
    const res = await axios.post(
      `${baseUrl}/Home/Search`,
      new URLSearchParams({ searchName: code }),
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "text/html,application/xhtml+xml",
        },
        maxRedirects: 5,
        timeout: 15000,
      }
    );

    console.log("Response status:", res.status);

    const $ = cheerio.load(res.data);

    // More flexible card detection
    const studentCard = $(".card-imagia")
      .filter((_, el) => {
        const cardText = $(el).text();
        const imgSrc = $(el).find("img").attr("src") || "";

        // Look for student-specific indicators
        return (
          /Uploads\/Card\//i.test(imgSrc) ||
          /كود الطالب/i.test(cardText) ||
          /الرقم القومي/i.test(cardText) ||
          /كلية/i.test(cardText)
        );
      })
      .first();

    if (studentCard.length === 0) {
      console.log("No student card found");
      return null;
    }

    const baseForImages = res.request?.res?.responseUrl ?? baseUrl;

    // More flexible image selection
    const imgElement = studentCard
      .find("img")
      .filter((_, img) => {
        const src = $(img).attr("src") || "";
        return /Uploads\/Card\//i.test(src);
      })
      .first();

    const imgUrlRaw = imgElement.attr("src") || "";
    const imgUrl = resolveUrl(imgUrlRaw, baseForImages);

    // Try multiple selectors for name
    const name = clean(
      studentCard.find(".name-imagia").text() ||
        studentCard
          .find("h2, h3, h4")
          .filter((_, el) => {
            const text = $(el).text();
            return !/ارشادات|الرؤية|الرسالة|جامعة/i.test(text);
          })
          .first()
          .text()
    );

    // More flexible code extraction
    const codeSelectors = [
      "p:contains('كود الطالب')",
      "p:contains('كود')",
      ".student-code",
      "[data-code]",
    ];

    let codeValue = "";
    for (const selector of codeSelectors) {
      const codeLine = clean(studentCard.find(selector).first().text());
      const codeMatch = codeLine.match(/(\d{6,})/);
      if (codeMatch) {
        codeValue = codeMatch[1];
        break;
      }
    }

    // Extract other fields with fallbacks
    const extractField = (selectors, label) => {
      for (const selector of selectors) {
        const text = clean(studentCard.find(selector).first().text());
        if (text) {
          return label ? stripLabel(text, label) : text;
        }
      }
      return "";
    };

    const faculty = extractField(
      ["p:contains('كلية')", ".faculty", "[data-faculty]"],
      "كلية"
    );

    const division = extractField(
      [
        "p:contains('شعبة')",
        "p:contains('قسم')",
        ".division",
        "[data-division]",
      ],
      "شعبة"
    );

    const level = extractField(
      [
        "p:contains('المستوى')",
        "p:contains('مستوى')",
        ".level",
        "[data-level]",
      ],
      "المستوى"
    );

    // Year extraction with multiple patterns
    const yearSelectors = [
      "p:contains('العام')",
      "p:contains('السنة')",
      ".year",
      "[data-year]",
    ];

    let year = "";
    for (const selector of yearSelectors) {
      const yearText = clean(studentCard.find(selector).first().text());
      const yearMatch = yearText.match(/\d{4}\/\d{4}|\d{4}-\d{4}|\d{4}/);
      if (yearMatch) {
        year = yearMatch[0];
        break;
      }
    }

    const semester = extractField(
      [
        "p:contains('الترم')",
        "p:contains('فصل')",
        ".semester",
        "[data-semester]",
      ],
      "الترم"
    );

    const email = extractField([
      "p em",
      ".email",
      "[data-email]",
      "p:contains('@')",
    ]);

    const barcode = extractField([
      ".footer-imagia h2",
      ".barcode",
      "[data-barcode]",
    ]);

    // Enhanced validation
    const isValidStudent =
      name &&
      (codeValue || imgUrlRaw.includes("Uploads/Card/")) &&
      (faculty || division || level); // At least one academic field

    if (!isValidStudent) {
      console.log("Invalid student data:", { name, codeValue, imgUrlRaw });
      return null;
    }

    return {
      imgUrl,
      name,
      code: codeValue,
      faculty,
      division,
      level,
      year,
      semester,
      email,
      barcode,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}

module.exports = { fetchAndScrape };
