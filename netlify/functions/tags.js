// tags.js
const fetch = global.fetch || require("node-fetch");

exports.handler = async function(event) {
  try {
    const { text } = JSON.parse(event.body || "{}");
    if (!text) return { statusCode: 400, body: JSON.stringify({ error: "No text provided" }) };

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const payload = {
      model: "gemma2-9b-it",
      messages: [{ role: "user", content: `Suggest 3–5 short tags for this note:\n\n${text}` }],
      max_tokens: 60
    };

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (!r.ok) return { statusCode: r.status, body: JSON.stringify(data) };

    const raw = data.choices?.[0]?.message?.content?.trim() || "";
    const tags = raw.split(/[,\\n]+/).map(s => s.trim()).filter(Boolean).slice(0,5);
    return { statusCode: 200, body: JSON.stringify({ tags }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Server error" }) };
  }
};
