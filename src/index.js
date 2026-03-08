import vectorIndex from "../vector_index.json";
import posts from "../posts_clean.json";
import router from "./dataset_router.json";
import rpwdSections from "./rpwd_sections.json";

/* =========================
   GLOBAL CACHES
========================= */

const articleMap = new Map();
for (const p of posts) articleMap.set(p.id, p);

const embeddingCache = new Map();

/* =========================
   COSINE SIMILARITY
========================= */

function cosineSimilarity(a,b){
let dot=0,normA=0,normB=0;

for(let i=0;i<a.length;i++){
dot+=a[i]*b[i];
normA+=a[i]*a[i];
normB+=b[i]*b[i];
}

return dot/(Math.sqrt(normA)*Math.sqrt(normB));
}

/* =========================
   NORMALIZE QUERY
========================= */

function normalizeQuery(q){
return q
.toLowerCase()
.replace(/[^\w\s]/g,"")
.replace(/\s+/g," ")
.trim();
}

/* =========================
   QUERY REWRITE
========================= */

async function rewriteQuery(question,env){

const prompt=`Rewrite this question into a concise search query.

Question:
${question}

Output only the improved query.`

const res=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}],
generationConfig:{temperature:0.1,maxOutputTokens:40}
})
}
)

const data=await res.json()

return data?.candidates?.[0]?.content?.parts?.[0]?.text || question
}

/* =========================
   ENTITY EXTRACTION
========================= */

function extractEntities(text){

const entities=[]

if(/rpwd|disabilities act/i.test(text))
entities.push("RPwD")

if(/reservation/i.test(text))
entities.push("reservation")

if(/employment|job/i.test(text))
entities.push("employment")

if(/education|student/i.test(text))
entities.push("education")

if(/assistive/i.test(text))
entities.push("assistive")

return entities
}

/* =========================
   GEMINI EMBEDDING
========================= */

async function embedQuery(question,env){

if(embeddingCache.has(question))
return embeddingCache.get(question)

const controller=new AbortController()
setTimeout(()=>controller.abort(),8000)

const res=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${env.GEMINI_API}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
signal:controller.signal,
body:JSON.stringify({
content:{parts:[{text:question}]}
})
}
)

const data=await res.json()

const vector=data?.embedding?.values

if(!vector)
throw new Error("Embedding failed")

embeddingCache.set(question,vector)

return vector
}

/* =========================
   SEMANTIC SEARCH
========================= */

async function semanticSearch(query,env){

const qVector=await embedQuery(query,env)

const results=[]

for(const item of vectorIndex){

const score=cosineSimilarity(qVector,item.vector)

if(score>0.32)
results.push({
id:item.id,
score
})

}

results.sort((a,b)=>b.score-a.score)

return results
}

/* =========================
   ADAPTIVE RETRIEVAL
========================= */

function adaptiveRetrieve(results){

if(results.length===0) return []

if(results[0].score>0.75)
return results.slice(0,3)

if(results[0].score>0.55)
return results.slice(0,5)

return results.slice(0,7)
}

/* =========================
   ARTICLE CONTEXT
========================= */

function retrieveArticles(matches){

let ctx=""
const sources=[]

for(const m of matches){

const article = articleMap.get(m.article_id)
if(!article) continue

const clean=article.content
.replace(/<[^>]+>/g,"")
.replace(/\s+/g," ")
.trim()

ctx+=`
TITLE: ${article.title}

CONTENT:
${clean.slice(0,700)}

SOURCE:${article.id}
SIMILARITY:${m.score.toFixed(3)}

---
`

sources.push({
id:article.id,
title:article.title,
score:m.score
})

}

return {ctx,sources}
}

/* =========================
   WIKIPEDIA
========================= */

async function wikiSearch(query){

try{

const res=await fetch(
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
)

if(!res.ok) return ""

const data=await res.json()

return data.extract?.slice(0,500) || ""

}catch{
return ""
}

}

/* =========================
   PROMPT BUILDER
========================= */

function buildPrompt(data){

return `You are EqualEdge AI.

Expertise:
• Disability rights law
• RPwD Act 2016
• Accessibility standards
• Inclusive education
• Assistive technology

User Question:
${data.question}

Detected Entities:
${data.entities.join(", ")}

RPwD Context:
${data.rpwd}

Relevant Articles:
${data.articles}

Wikipedia Context:
${data.wiki}

Instructions:
Provide a clear factual answer.
Cite article titles if used.
Avoid speculation.`
}

/* =========================
   WORKER HANDLER
========================= */

export default {

async fetch(request,env){

const cors={
"Access-Control-Allow-Origin":"*",
"Access-Control-Allow-Headers":"Content-Type",
"Access-Control-Allow-Methods":"POST, OPTIONS"
}

const headers={...cors,"Content-Type":"application/json"}

const url=new URL(request.url)

if(request.method==="OPTIONS")
return new Response(null,{headers:cors})

if(url.pathname!=="/ask")
return new Response(JSON.stringify({status:"EqualEdge AI running"}),{headers})

if(request.method!=="POST")
return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers})

try{

const {question}=await request.json()

if(!question)
return new Response(JSON.stringify({error:"Question required"}),{status:400,headers})

const normalized=normalizeQuery(question)

const rewritten=await rewriteQuery(normalized,env)

const entities=extractEntities(rewritten)

const rawMatches=await semanticSearch(rewritten,env)

const matches=adaptiveRetrieve(rawMatches)

const {ctx,sources}=retrieveArticles(matches)

const rpwd=rpwdSections
.filter(s=>entities.some(e=>s.keywords?.includes(e)))
.slice(0,3)
.map(s=>`${s.section} ${s.title}\n${s.content}`)
.join("\n\n")

const wiki=await wikiSearch(rewritten)

const prompt=buildPrompt({
question:rewritten,
entities,
rpwd,
articles:ctx,
wiki
})

const aiRes=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}],
generationConfig:{
temperature:0.2,
maxOutputTokens:700
}
})
}
)

const data=await aiRes.json()

const answer=
data?.candidates?.[0]?.content?.parts?.[0]?.text
||"No answer generated"

return new Response(JSON.stringify({
answer,
sources,
semantic_matches:matches.length
}),{headers})

}catch(err){

return new Response(JSON.stringify({
error:"Server error",
details:err.message
}),{status:500,headers})

}

}

}
