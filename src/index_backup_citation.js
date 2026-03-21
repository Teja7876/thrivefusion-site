const MODEL = "@cf/meta/llama-3-8b-instruct"

// TRUST SCORE
function trustScore(url){
if(url.includes("gov.in")) return 5
if(url.includes("nic.in")) return 5
if(url.includes("org")) return 3
return 1
}

// CLEAN
function clean(text){
return text.replace(/\s+/g," ").trim().slice(0,800)
}

// FETCH PAGE
async function fetchPage(url){
try{
const res = await fetch(url,{headers:{ "User-Agent":"Mozilla/5.0"}})
const html = await res.text()

const text = html
.replace(/<script[\s\S]*?<\/script>/gi,"")
.replace(/<style[\s\S]*?<\/style>/gi,"")
.replace(/<[^>]+>/g," ")
.replace(/\s+/g," ")

return clean(text)

}catch{
return ""
}
}

// SEARCH
async function webSearch(query){
const html = await (await fetch("https://html.duckduckgo.com/html/?q="+encodeURIComponent(query))).text()

const results=[]
const regex=/class="result__a" href="(.*?)">(.*?)<\/a>/g
let match

while((match=regex.exec(html))!==null && results.length<5){
let link = decodeURIComponent(match[1].split("uddg=")[1] || "")
if(link.startsWith("http")){
const content = await fetchPage(link)
if(content.length>200){
results.push({
url:link,
content,
trust: trustScore(link)
})
}
}
}

return results
}

// RANK (trust + keyword)
function rank(query, items){
const q = query.toLowerCase().split(" ")

return items.map(i=>{
let score = i.trust * 5
const t = i.content.toLowerCase()

q.forEach(w=>{
if(t.includes(w)) score += 2
})

return {...i, score}
})
.sort((a,b)=>b.score-a.score)
.slice(0,3)
}

// AI (STRICT FACT MODE)
async function askAI(query, context, env){

const prompt = `
You are a factual assistant.

Use ONLY the context below.

If information conflicts:
- Prefer government or official sources.

If not found:
Say "Not enough data"

Question:
${query}

Context:
${context}

Answer format:
- short explanation
- bullet points
`

const res = await env.AI.run(MODEL,{
prompt,
max_tokens:200
})

return res.response || "No answer"
}

// MAIN
export default {
async fetch(req, env){

const url = new URL(req.url)

if(url.pathname === "/search"){

const q = url.searchParams.get("q")
if(!q) return new Response(JSON.stringify({error:"query required"}),{status:400})

const web = await webSearch(q)
const ranked = rank(q, web)

const context = ranked.map(r=>r.content).join("\n")

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
