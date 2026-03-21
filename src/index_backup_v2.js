const MODEL = "@cf/meta/llama-3-8b-instruct"

// CLEAN TEXT
function clean(text){
  return text.replace(/\s+/g," ").trim()
}

// EXTRACT RELEVANT SENTENCES
function extractRelevant(query, text){
  const words = query.toLowerCase().split(" ")
  const sentences = text.split(". ")

  return sentences
    .filter(s => words.some(w => s.toLowerCase().includes(w)))
    .slice(0,5)
    .join(". ")
}

// FETCH PAGE (HTML ONLY)
async function fetchPage(url){
  try{
    const res = await fetch(url,{
      headers:{ "User-Agent":"Mozilla/5.0" }
    })

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

// SEARCH ONLY TRUSTED SOURCES
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

    // 🚫 SKIP PDFs (critical)
    if(link.endsWith(".pdf")) continue

    const page = await fetchPage(link)

    const snippet = extractRelevant(query, page).slice(0,1200)

    if(snippet.length > 100){
      results.push({
        url: link,
        content: snippet
      })
    }

    // ✅ ONLY 1 SOURCE (fast + stable)
    if(results.length >= 1) break
  }

  return results
}

// AI (STRICT)
async function askAI(query, sources, env){

  const context = sources.map((s,i)=>`[${i+1}] ${s.content}`).join("\n")

  const prompt = `
STRICT RULES:
- Use ONLY the source
- No guessing
- Keep answer short

Question:
${query}

Source:
${context}

Answer:
- short explanation [1]
- 3 bullet points with [1]
`

  const res = await env.AI.run(MODEL,{
    prompt,
    max_tokens:150
  })

  return res.response || "No answer"
}

// MAIN
export default {
  async fetch(req, env){

    const url = new URL(req.url)

    if(url.pathname === "/search"){

      const q = url.searchParams.get("q")
      if(!q){
        return new Response(JSON.stringify({error:"query required"}),{
          status:400
        })
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
