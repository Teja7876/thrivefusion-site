const EMBEDDING_MODEL = "@cf/baai/bge-base-en-v1.5"
const AI_MODEL = "@cf/meta/llama-3-8b-instruct"

// VECTOR SEARCH
async function vectorSearch(query, env){
if(!env.AI || !env.VECTOR_INDEX) throw new Error("Bindings missing")

const embedding = (await env.AI.run(EMBEDDING_MODEL,{input:query})).data[0]

const results = await env.VECTOR_INDEX.query(embedding,{
topK:8,
returnMetadata:true
})

return (results.matches || []).map(m=>({
url: m.metadata?.url || "kb",
content: m.metadata?.text || ""
}))
}

// SIMPLE WEB SEARCH
async function webSearch(query){
const url = "https://html.duckduckgo.com/html/?q="+encodeURIComponent(query)
const html = await (await fetch(url)).text()

const links = []
const regex = /class="result__a" href="(.*?)">(.*?)<\/a>/g
let match

while((match = regex.exec(html)) !== null && links.length < 5){
let link = decodeURIComponent(match[1].split("uddg=")[1] || "")
if(link.startsWith("http")){
links.push({
url: link,
content: match[2].replace(/<[^>]+>/g,"")
})
}
}

return links
}

// CLEAN CONTENT
function clean(text){
return text
.replace(/\s+/g," ")
.trim()
.slice(0,300)
}

// SIMPLE RANKING
function score(query, text){
let q = query.toLowerCase().split(" ")
let t = text.toLowerCase()

let s = 0
q.forEach(word=>{
if(t.includes(word)) s += 2
})

return s + text.length * 0.001
}

// MAIN ROUTER
async function route(query, env){

const [vec, web] = await Promise.all([
vectorSearch(query, env),
webSearch(query)
])

let combined = [...vec, ...web]

// CLEAN + SCORE
combined = combined
.map(item=>({
...item,
content: clean(item.content),
score: score(query, item.content)
}))
.filter(x=>x.content.length > 20)

// SORT
combined.sort((a,b)=>b.score - a.score)

// TAKE TOP 5
return combined.slice(0,5)
}

// RESPONSE
function json(data, status=200){
return new Response(JSON.stringify(data),{
status,
headers:{
"Content-Type":"application/json",
"Access-Control-Allow-Origin":"*"
}
})
}

// AI CALL
async function askAI(query, context, env){

const prompt = `
You are an accessibility expert AI.

Answer clearly using the context below.

Question:
${query}

Context:
${context}

Rules:
- Be accurate
- Be concise
- Use bullet points if helpful
- If unsure, say "Not enough data"
`

const res = await env.AI.run(AI_MODEL,{
prompt,
max_tokens:200
})

return res.response || "No answer"
}

// HANDLER
export default {
async fetch(req, env){

const url = new URL(req.url)

if(url.pathname === "/search"){

const q = url.searchParams.get("q")
if(!q) return json({error:"query required"},400)

try{

const results = await route(q, env)

const context = results.map(r=>r.content).join("\n")

const answer = await askAI(q, context, env)

return json({
success:true,
answer,
sources: results.map(r=>r.url)
})

}catch(e){
return json({success:false,error:e.message},500)
}

}

return json({status:"AI running"})
}
}
