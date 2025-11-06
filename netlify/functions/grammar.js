// grammar.js
const fetch = global.fetch || require("node-fetch");

exports.handler = async function(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 400, body: JSON.stringify({ error: "No text provided" }) };

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const payload = {
      model: "openai/gpt-oss-20b",
      messages: [{
        role: "user",
        content: `Find grammar issues in the text below and return a JSON object like {"issues":[{"text":"...", "suggestion":"..."}]}:\n\n${text}`
      }],
      max_tokens: 300,
      temperature: 0
    };

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return { statusCode: r.status, body: JSON.stringify(data) };

    const content = data.choices?.[0]?.message?.content || "";
    let issues = [];
    try {
      const parsed = JSON.parse(content);
      issues = parsed.issues || [];
    } catch {
      issues = [{ text: "Parse error", suggestion: content }];
    }

    return { statusCode: 200, body: JSON.stringify({ issues }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
