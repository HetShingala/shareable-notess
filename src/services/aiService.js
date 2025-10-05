// aiService.js
const API_BASE = import.meta.env.VITE_API_BASE || "/.netlify/functions";

async function postJSON(path, body){
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function summarize(text){
  return postJSON("/summarize", { text });
}
export async function suggestTags(text){
  return postJSON("/tags", { text });
}
export async function glossaryTerms(text){
  return postJSON("/glossary", { text });
}
export async function grammarCheck(text){
  return postJSON("/grammar", { text });
}
