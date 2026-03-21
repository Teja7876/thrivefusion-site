const MODEL = "@cf/meta/llama-3-8b-instruct"

// QUERY EXPANSION
function expandQuery(q){
const map = {
"rpwd":"rights of persons with disabilities",
"act":"law legislation"
}

let expanded = q.toLowerCase()

Object.keys(map).forEach(k=>{
if(expanded.includes(k)){
expanded += " " + map[k]
}
})

return expanded
}

// CLEAN
function clean(text){
return text.replace(/\s+/g," ").trim()
}

// SNIPPETS
function extractSnippets(query, text){
const expanded = expandQuery(query)
const words = expanded.split(" ")

const sentences = text.split(". ")

return sentences.filter(s=>{
const t = s.toLowerCase()
return words.some(w => t.includes(w))
}).slice(0,5).join(". ")
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

while((match=regex.exec(html))!==null && results.length<4){
let link = decodeURIComponent(match[1].split("uddg=")[1] || "")
if(link.startsWith("http")){
const page = await fetchPage(link)
const snippet = extractSnippets(query, page)

if(snippet.length>50){
results.push({
url:link,
content:snippet
})
}
}
}

return results
}

// STRICT AI
async function askAI(query, sources, env){

const context = sources.map((s,i)=>`[${i+1}] ${s.content}`).join("\n")

const prompt = `
STRICT RULES:
- Use ONLY sources
- EVERY bullet MUST have citation [1]
- No guessing

Question:
${query}

Sources:
${context}

Answer:
- short explanation [1]
- bullet points with citations
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
