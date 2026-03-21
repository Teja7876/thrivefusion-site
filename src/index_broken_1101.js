const MODEL = "@cf/meta/llama-3-8b-instruct"

// KEEP EVERYTHING SAME ABOVE (only AI function changed)

// AI WITH STRICT CITATION
async function askAI(query, sources, env){

const context = sources.map((s,i)=>`[${i+1}] ${s.content}`).join("\n")

const prompt = `
You MUST follow these rules:

1. Use ONLY the sources
2. EVERY bullet point MUST include a citation like [1]
3. If you cannot cite, DO NOT include that point
4. No general knowledge allowed

Question:
${query}

Sources:
${context}

Answer format:
- short explanation (with citation)
- bullet points (each with citation)
`

const res = await env.AI.run(MODEL,{
prompt,
max_tokens:200
})

return res.response || "No answer"
}

// MAIN (same as before)
export default {
async fetch(req, env){

const url = new URL(req.url)

if(url.pathname === "/search"){

const q = url.searchParams.get("q")
if(!q) return new Response(JSON.stringify({error:"query required"}),{status:400})

const sources = await webSearch(q)
const answer = await askAI(q, sources, env)

return new Response(JSON.stringify({
success:true,
answer,
sources: sources.map((s,i)=>({id:i+1,url:s.url}))
}), {headers:{ "Content-Type":"application/json"}})
}

return new Response("ok")
}
}
