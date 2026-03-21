const MODEL = "@cf/meta/llama-3-8b-instruct"

// KEEP ALL SAME CODE ABOVE

async function askAI(query, sources, env){

  const context = sources.map((s,i)=>`[${i+1}] ${s.content}`).join("\n")

  const prompt = `
STRICT RULES:
- Use ONLY sources
- MUST include number of disabilities
- No repetition
- Do not restart answer

Question:
${query}

Sources:
${context}

Answer:
- short explanation
- 3 to 5 bullet points
`

  const res = await env.AI.run(MODEL,{
    prompt,
    max_tokens:300   // 🔥 increased
  })

  // 🔥 CLEAN DUPLICATION FIX
  let answer = res.response || "No answer"

  // remove accidental double answers
  const parts = answer.split("Based on")
  if(parts.length > 1){
    answer = parts[0]
  }

  return answer.trim()
}

// KEEP MAIN SAME
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
