import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface InitiativeToVerify {
  name: string
  url: string | null
  instagram: string | null
  description: string
  type: string
}

export interface VerificationResult {
  verified: boolean
  confidence: 'high' | 'medium' | 'low'
  notes: string
}

export async function verifyInitiative(
  initiative: InitiativeToVerify
): Promise<VerificationResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    tools: [{ googleSearchRetrieval: {} }],
  })

  const searchTarget = initiative.url ?? initiative.instagram ?? initiative.name

  const prompt = `Usando Google Search, verifica si esta iniciativa es real y está activamente relacionada con la ayuda por el terremoto en Venezuela (junio 2026).

Nombre: ${initiative.name}
Enlace: ${searchTarget}
Descripción: ${initiative.description}
Tipo: ${initiative.type}

Busca en Google evidencia de que esta organización/campaña existe y está ayudando con el terremoto de Venezuela.
Responde con este JSON exacto:
{
  "verified": true o false,
  "confidence": "high", "medium" o "low",
  "notes": "explicación breve de lo que encontraste o no pudiste confirmar"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const cleaned = text.replace(/```(?:json)?\n?/g, '').trim()

  try {
    return JSON.parse(cleaned) as VerificationResult
  } catch {
    return {
      verified: false,
      confidence: 'low',
      notes: `No se pudo parsear la respuesta del modelo: ${text.slice(0, 200)}`,
    }
  }
}
