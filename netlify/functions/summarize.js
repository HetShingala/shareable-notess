// netlify/functions/summarize.js
export async function handler(event) {
  const { text } = JSON.parse(event.body);

  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gemma2-9b-it",
      messages: [{ role: "user", content: `Summarize this text:\n\n${text}` }],
    }),
  });

  const data = await r.json();
  const summary = data.choices?.[0]?.message?.content || "No summary found";
  return {
    statusCode: 200,
    body: JSON.stringify({ summary }),
  };
}
