/**
 * Folio — Groq API Service
 * Model: llama-3.3-70b-versatile (FREE)
 * Get key at: https://console.groq.com
 * .env: VITE_GROQ_API_KEY=your-key-here
 */

const MODEL = 'llama-3.3-70b-versatile'
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

async function extractTextFromPDF(pdfBase64) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  }
  const binary = atob(pdfBase64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map(item => item.str).join(' ') + '\n'
  }
  return fullText.trim()
}

async function callGroq(prompt) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY
  if (!apiKey) throw new Error('Missing API key. Create a .env file with VITE_GROQ_API_KEY=your-key')

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error: ${response.status}`)
  }

  const data = await response.json()
  return data?.choices?.[0]?.message?.content || ''
}

export async function analyzeCVForPortfolio({ pdfBase64 }) {
  let cvText
  try {
    cvText = await extractTextFromPDF(pdfBase64)
  } catch (e) {
    throw new Error('Could not read PDF. Make sure it is a text-based PDF (not a scanned image).')
  }
  if (!cvText || cvText.length < 100) {
    throw new Error('Could not extract text from PDF. Make sure it is not a scanned image.')
  }

  const prompt = `You are an expert career coach and portfolio builder with 15+ years experience.
Analyze this CV text and extract all information needed to build a personal portfolio website.
Also provide honest, specific suggestions for improvements, AND write a fully improved version of the CV.

CV TEXT:
${cvText}

Return ONLY a single valid JSON object with NO markdown fences, NO preamble, NO extra text — just raw JSON:
{
  "personal": {
    "name": "<full name>",
    "title": "<professional title/role>",
    "email": "<email if present, else null>",
    "phone": "<phone if present, else null>",
    "location": "<city/country if present, else null>",
    "linkedin": "<linkedin url if present, else null>",
    "github": "<github url if present, else null>",
    "website": "<personal website if present, else null>",
    "bio": "<2-3 sentence professional summary — if not in CV, write one based on their experience>"
  },
  "overall_score": <integer 0-100>,
  "scores": {
    "skills_clarity": <integer 0-100>,
    "project_quality": <integer 0-100>,
    "experience_depth": <integer 0-100>,
    "portfolio_readiness": <integer 0-100>,
    "overall_impression": <integer 0-100>
  },
  "verdict": "<one honest sentence assessment>",
  "cv_suggestions": [
    { "type": "<critical|improvement|optional>", "title": "<short title>", "detail": "<specific actionable suggestion>" }
  ],
  "improved_cv": "<full improved CV as plain text — rewrite the entire CV with better wording, stronger action verbs, added metrics, improved structure, and all the suggestions applied. Format it clearly with sections like SUMMARY, EXPERIENCE, SKILLS, PROJECTS, EDUCATION>",
  "skills": [
    { "name": "<skill name>", "category": "<Frontend|Backend|Database|DevOps|Tools|Design|Other>", "level": <integer 0-100> }
  ],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. Jan 2022 – Present>",
      "description": "<2-3 sentence summary of responsibilities and achievements>"
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<2-3 sentence description>",
      "tech": ["<tech1>", "<tech2>"],
      "link": "<url if present, else null>"
    }
  ],
  "education": [
    {
      "institution": "<institution name>",
      "degree": "<degree and field>",
      "year": "<graduation year or range>"
    }
  ],
  "certifications": ["<cert name if any>"],
  "languages": ["<language and level, e.g. Arabic (Native)>"]
}`

  const text = await callGroq(prompt)
  const clean = text.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(clean)
  } catch {
    throw new Error('Failed to parse response. Please try again.')
  }
}
