export default {
  async fetch(request) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return json({ error: "Missing query" });
    }

    // -------------------------
    // SEMANTIC QUERY
    // -------------------------
    const mappedQuery = mapQuery(query);

    // -------------------------
    // FETCH (API ONLY)
    // -------------------------
    const results = [];

    try {
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${mappedQuery}`;
      const res = await fetch(wikiUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "application/json"
        }
      });

      const data = await res.json();
      if (data.extract) {
        results.push({
          url: wikiUrl,
          content: data.extract,
          trust: 2
        });
      }
    } catch {}

    // -------------------------
    // FACT EXTRACTION
    // -------------------------
    const answer = [];

    results.forEach((r, i) => {
      const facts = extractFacts(r.content);
      facts.forEach(f => {
        answer.push({
          point: f,
          source: i + 1
        });
      });
    });

    const sources = results.map((r, i) => ({
      id: i + 1,
      url: r.url
    }));

    return json({
      success: true,
      answer,
      sources
    });
  }
};

// -------------------------
// SEMANTIC QUERY
// -------------------------
function mapQuery(query) {
  const q = query.toLowerCase().trim();

  const expansions = {
    "rpwd": "Rights_of_Persons_with_Disabilities_Act,_2016",
    "pwd": "disability rights law",
    "who": "World_Health_Organization",
    "un": "United_Nations",
    "gdp": "Gross_domestic_product"
  };

  for (const key in expansions) {
    if (q.includes(key)) {
      return expansions[key];
    }
  }

  return q.replace(/\s+/g, "_");
}

// -------------------------
// FACT EXTRACTION
// -------------------------
function extractFacts(text) {
  if (!text) return [];

  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 40);

  const scored = sentences.map(s => {
    let score = 0;

    if (/\d/.test(s)) score += 2;
    if (s.toLowerCase().includes("law") || s.toLowerCase().includes("act")) score += 1;

    return { sentence: s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map(s => s.sentence);
}

// -------------------------
// JSON HELPER
// -------------------------
function json(data) {
  return new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
}
