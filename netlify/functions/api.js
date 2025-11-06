const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function openaiRequest(payload) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function handler(event) {
  const path = event.path;
  const body = JSON.parse(event.body || "{}");
  const text = body.text;

  try {
    let result = {};

    if (path.includes("/summarize")) {
      const r = await openaiRequest({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Summarize this in 2 lines:\n${text}` }],
        max_tokens: 80,
        temperature: 0.2,
      });
      result = { summary: r.choices?.[0]?.message?.content?.trim() };
    }

    else if (path.includes("/tags")) {
      const r = await openaiRequest({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Give 3–5 short tags for this note:\n${text}` }],
      });
      const raw = r.choices?.[0]?.message?.content || "";
      result = { tags: raw.split(/[,\\n]+/).map(s => s.trim()).filter(Boolean) };
    }

    else if (path.includes("/grammar")) {
      const r = await openaiRequest({
        model: "openai/gpt-oss-20b",
        messages: [{
          role: "user",
          content: `Find grammar mistakes and return JSON {"issues":[{"text":"...", "suggestion":"..."}]}:\n\n${text}`,
        }],
      });
      const content = r.choices?.[0]?.message?.content || "";
      result = { grammar: content };
    }

    else if (path.includes("/glossary")) {
      const r = await openaiRequest({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Extract key terms with 1-line definitions:\n${text}` }],
      });
      result = { glossary: r.choices?.[0]?.message?.content };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (err) {
    console.error("AI function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI processing failed" }),
    };
  }
}
