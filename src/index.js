const MODEL = "@cf/meta/llama-3-8b-instruct"

// CLEAN
function clean(text){
  return text.replace(/\s+/g," ").trim()
}

// 🔥 BALANCED EXTRACTION
function extractRelevant(query, text){
  const sentences = text.split(". ")

  let filtered = sentences.filter(s=>{
    const t = s.toLowerCase()

    return (
      t.includes("act") ||
      t.includes("disabilities") ||
      t.includes("rights") ||
      t.match(/\b\d+\b/)
    )
  })

  // fallback if too strict
  if(filtered.length < 3){
    filtered = sentences.slice(0,6)
  }

  return filtered.slice(0,6).join(". ")
}

// FETCH
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

  const searchQuery = query + " site:gov.in OR site:nic.in OR site:org"

  const html = await (await fetch(
    "https://html.duckduckgo.com/html/?q=" + encodeURIComponent(searchQuery)
  )).text()

  const results=[]
  const regex=/class="result__a" href="(.*?)">(.*?)<\/a>/g

  let match

  while((match=regex.exec(html))!==null){

    let link = decodeURIComponent(match[1].split("uddg=")[1] || "")

    if(!link.startsWith("http")) continue
    if(link.endsWith(".pdf")) continue

    const page = await fetchPage(link)
    const snippet = extractRelevant(query, page).slice(0,1500)

    if(snippet.length > 80){
      results.push({
        url: link,
        content: snippet
      })
    }

    if(results.length >= 2) break
  }

  return results
}

// AI (STRICT BUT SAFE)
async function askAI(query, sources, env){

  const context = sources.map((s,i)=>`[${i+1}] ${s.content}`).join("\n")

  const prompt = `
Use ONLY the sources.

Do NOT add external info.
If unsure, skip.

Question:
${query}

Sources:
${context}

Answer:
- short explanation
- bullet points
`

  const res = await env.AI.run(MODEL,{
    prompt,
    max_tokens:200
  })

  return (res.response || "").trim()
}

// MAIN
export default {
  async fetch(req, env){

    const url = new URL(req.url)

    if(url.pathname === "/search"){

      const q = url.searchParams.get("q")
      if(!q){
        return new Response(JSON.stringify({error:"query required"}),{status:400})
      }

      const sources = await webSearch(q)

      if(sources.length === 0){
        return new Response(JSON.stringify({
          success:true,
          answer:"No reliable source found",
          sources:[]
        }))
      }

      const answer = await askAI(q, sources, env)

      return new Response(JSON.stringify({
        success:true,
        answer,
        sources: sources.map((s,i)=>({id:i+1,url:s.url}))
      }),{
        headers:{ "Content-Type":"application/json" }
      })
    }

    return new Response("ok")
  }
}
