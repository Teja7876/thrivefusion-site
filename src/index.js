import vectorIndex from "../vector_index.json";
import posts from "../posts_clean.json";
import router from "./dataset_router.json";
import rpwdSections from "./rpwd_sections.json";
import { pipeline } from "@xenova/transformers";

/* =================================
   GLOBAL CACHE
================================= */

let embedder;
const embeddingCache = new Map();

/* =================================
   PRELOAD ARTICLES
================================= */

const articleMap = new Map();
for (const p of posts) articleMap.set(p.id, p);

/* =================================
   EMBEDDING MODEL LOADER
================================= */

async function getEmbedder(){

if(!embedder){

embedder = await pipeline(
"feature-extraction",
"Xenova/all-MiniLM-L6-v2"
);

}

return embedder;

}

/* =================================
   COSINE SIMILARITY
================================= */

function cosineSimilarity(a,b){

let dot=0,normA=0,normB=0;

for(let i=0;i<a.length;i++){

dot+=a[i]*b[i];
normA+=a[i]*a[i];
normB+=b[i]*b[i];

}

return dot/(Math.sqrt(normA)*Math.sqrt(normB));

}

/* =================================
   QUESTION EMBEDDING (CACHED)
================================= */

async function embedQuestion(q){

if(embeddingCache.has(q))
return embeddingCache.get(q);

const model = await getEmbedder();

const emb = await model(q,{
pooling:"mean",
normalize:true
});

embeddingCache.set(q,emb.data);

return emb.data;

}

/* =================================
   SEMANTIC SEARCH
================================= */

async function semanticSearch(question){

const qVector = await embedQuestion(question);

const results=[];

for(const item of vectorIndex){

const score=cosineSimilarity(qVector,item.vector);

if(score>0.40){
results.push({id:item.id,score});
}

}

results.sort((a,b)=>b.score-a.score);

return results.slice(0,4);

}

/* =================================
   ARTICLE CONTEXT
================================= */

function retrieveArticles(matches){

let ctx="";

for(const m of matches){

const article=articleMap.get(m.id);

if(!article) continue;

const clean=article.content
.replace(/<[^>]+>/g,"")
.replace(/\s+/g," ")
.trim();

ctx+=`
TITLE: ${article.title}

CONTENT:
${clean.slice(0,800)}

SIMILARITY: ${m.score.toFixed(3)}

---
`;

}

return ctx;

}

/* =================================
   WIKIPEDIA
================================= */

async function wikiSearch(query){

try{

const res=await fetch(
`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
);

if(!res.ok) return "";

const data=await res.json();

return data.extract
? `WIKIPEDIA:\n${data.extract.slice(0,600)}`
: "";

}catch{
return "";
}

}

/* =================================
   DUCKDUCKGO
================================= */

async function duckSearch(query){

try{

const controller=new AbortController();
const timeout=setTimeout(()=>controller.abort(),3500);

const res=await fetch(
`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`,
{signal:controller.signal}
);

clearTimeout(timeout);

if(!res.ok) return "";

const data=await res.json();

let text="";

if(data.Abstract) text+=data.Abstract+"\n";

if(data.RelatedTopics){

for(const t of data.RelatedTopics.slice(0,3)){
if(t.Text) text+=t.Text+"\n";
}

}

return text.slice(0,500);

}catch{
return "";
}

}

/* =================================
   DOMAIN DETECTION
================================= */

function detectDomain(q){

if(/student|education|school/i.test(q))
return "education";

if(/job|employment|work/i.test(q))
return "employment";

if(/hospital|health|medical/i.test(q))
return "healthcare";

if(/assistive|technology|device/i.test(q))
return "assistive_technology";

return "legal";

}

/* =================================
   PROMPT BUILDER
================================= */

function buildPrompt({
question,
rpwd,
articles,
datasets,
wiki,
web
}){

return `
You are EqualEdge AI.

You specialize in:

• Disability rights
• Accessibility law
• Inclusive education
• Assistive technology
• Government disability schemes in India

RPwD references:
${rpwd}

Relevant articles:
${articles}

Dataset references:
${datasets}

Wikipedia context:
${wiki}

External web context:
${web}

User question:
${question}

Instructions:
Answer clearly and factually.
Cite RPwD Act sections when relevant.
Avoid speculation.
`;
}

/* =================================
   WORKER
================================= */

export default {

async fetch(request,env){

const cors={
"Access-Control-Allow-Origin":"*",
"Access-Control-Allow-Headers":"Content-Type",
"Access-Control-Allow-Methods":"POST, OPTIONS"
};

const headers={...cors,"Content-Type":"application/json"};

const url=new URL(request.url);

/* CORS */

if(request.method==="OPTIONS")
return new Response(null,{headers:cors});

/* HEALTH */

if(url.pathname!=="/ask")
return new Response(
JSON.stringify({
status:"EqualEdge AI running",
endpoint:"/ask"
}),
{headers}
);

/* METHOD */

if(request.method!=="POST")
return new Response(
JSON.stringify({error:"Method not allowed"}),
{status:405,headers}
);

try{

/* BODY */

let question;

const raw=await request.text();

try{
question=JSON.parse(raw).question;
}catch{
const params=new URLSearchParams(raw);
question=params.get("question");
}

if(!question)
return new Response(
JSON.stringify({error:"Question required"}),
{status:400,headers}
);

question=question.trim();

/* PARALLEL CONTEXT FETCH */

const matches = await semanticSearch(question);

const articleContext = retrieveArticles(matches);

const q = question.toLowerCase();

const domain = detectDomain(q);

/* RPWD */

const relevantSections = rpwdSections
.filter(s=>(s.keywords||[])
.some(k=>q.includes(k.toLowerCase())))
.slice(0,3)
.map(s=>`${s.section} - ${s.title}\n${s.content}`)
.join("\n\n");

/* DATASETS */

const datasets = router
.filter(d=>d.domain===domain)
.slice(0,5);

const datasetContext = datasets.map(d=>d.file).join("\n");

/* PARALLEL EXTERNAL SEARCH */

const [wikiContext,webContext] = await Promise.all([
wikiSearch(question),
duckSearch(question)
]);

/* PROMPT */

const prompt = buildPrompt({
question,
rpwd:relevantSections,
articles:articleContext,
datasets:datasetContext,
wiki:wikiContext,
web:webContext
});

/* GEMINI */

const controller=new AbortController();
setTimeout(()=>controller.abort(),15000);

const aiRes=await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
signal:controller.signal,
body:JSON.stringify({
contents:[{parts:[{text:prompt}]}],
generationConfig:{
temperature:0.2,
maxOutputTokens:800
}
})
}
);

if(!aiRes.ok)
throw new Error("AI service error");

const data=await aiRes.json();

const answer=
data?.candidates?.[0]?.content?.parts?.[0]?.text
||"No answer generated";

return new Response(
JSON.stringify({
answer,
domain,
semantic_matches:matches.length,
web_context_used:!!webContext
}),
{headers}
);

}catch(err){

return new Response(
JSON.stringify({
error:"Server error",
details:err.message
}),
{status:500,headers}
);

}

}

};