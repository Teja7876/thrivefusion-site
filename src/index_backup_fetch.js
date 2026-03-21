const MODEL = "@cf/meta/llama-3-8b-instruct"

function clean(text){
return text.replace(/\s+/g," ").trim().slice(0,300)
}

function rank(query, items){
const q = query.toLowerCase().split(" ")
return items
.map(i=>{
let score=0
const t=i.content.toLowerCase()
q.forEach(w=>{ if(t.includes(w)) score+=2 })
return {...i, score}
})
.filter(x=>x.content.length>20)
.sort((a,b)=>b.score-a.score)
.slice(0,5)
}

async function askAI(query, context, env){
const prompt = `
You are a STRICT factual assistant.

Answer ONLY using the provided context.

If information is missing, say:
"Not enough data"

Do NOT guess.
Do NOT add outside knowledge.

Question:
${query}

Context:
${context}

Output format:
- Short explanation
- Bullet points
- Cite facts only from context
`

const res = await env.AI.run(MODEL,{
prompt,
max_tokens:180
})

return res.response || "No answer"
}

export default {
async fetch(req, env){

const url = new URL(req.url)

if(url.pathname === "/search"){

const q = url.searchParams.get("q")
if(!q) return new Response(JSON.stringify({error:"query required"}),{status:400})

let results=[]

try{
if(env.VECTOR_INDEX && env.AI){
const emb = (await env.AI.run("@cf/baai/bge-base-en-v1.5",{input:q})).data[0]
const r = await env.VECTOR_INDEX.query(emb,{topK:5,returnMetadata:true})
results = (r.matches||[]).map(m=>({
url:m.metadata?.url||"",
content:m.metadata?.text||""
}))
}
}catch{}

try{
const html = await (await fetch("https://html.duckduckgo.com/html/?q="+encodeURIComponent(q))).text()
const regex=/class="result__a" href="(.*?)">(.*?)<\/a>/g
let match
while((match=regex.exec(html))!==null && results.length<8){
let link=decodeURIComponent(match[1].split("uddg=")[1]||"")
if(link.startsWith("http")){
results.push({url:link,content:match[2].replace(/<[^>]+>/g,"")})
}
}
}catch{}

const ranked = rank(q, results)
const context = ranked.map(r=>clean(r.content)).join("\n")

const answer = await askAI(q, context, env)

return new Response(JSON.stringify({
success:true,
answer,
sources: ranked.map(r=>r.url)
}), {headers:{ "Content-Type":"application/json"}})
}

return new Response("ok")
}
}
