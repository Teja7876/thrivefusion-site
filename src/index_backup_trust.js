const MODEL = "@cf/meta/llama-3-8b-instruct"

// CLEAN TEXT
function clean(text){
return text.replace(/\s+/g," ").trim().slice(0,500)
}

// FETCH PAGE CONTENT
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

// WEB SEARCH + CONTENT
async function webSearch(query){
const url = "https://html.duckduckgo.com/html/?q="+encodeURIComponent(query)
const html = await (await fetch(url)).text()

const results=[]
const regex=/class="result__a" href="(.*?)">(.*?)<\/a>/g
let match

while((match=regex.exec(html))!==null && results.length<3){
let link = decodeURIComponent(match[1].split("uddg=")[1] || "")
if(link.startsWith("http")){
const content = await fetchPage(link)
if(content.length>100){
results.push({url:link,content})
}
}
}

return results
}

// RANK
function rank(query, items){
const q = query.toLowerCase().split(" ")

return items
.map(i=>{
let score=0
const t=i.content.toLowerCase()
q.forEach(w=>{ if(t.includes(w)) score+=2 })
return {...i,score}
})
.sort((a,b)=>b.score-a.score)
.slice(0,3)
}

// AI
async function askAI(query, context, env){
const prompt = `
Answer using the context below.

If context is weak, answer normally but stay factual.

Question:
${query}

Context:
${context}

Give:
- clear explanation
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
