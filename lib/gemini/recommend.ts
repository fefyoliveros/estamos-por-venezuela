import { GoogleGenerativeAI, SchemaType, type Schema } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface UserAnswers {
  location: string
  support_type: string
  availability: string
}

export interface Recommendation {
  summary: string
  priority: 'high' | 'medium' | 'low'
  suggested_actions: string[]
  resource_types: string[]
  reasoning: string
}

const recommendationSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: 'One-sentence summary of the recommended action for this person',
      nullable: false,
    },
    priority: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['high', 'medium', 'low'],
      nullable: false,
    },
    suggested_actions: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'List of 3-5 concrete, specific next steps',
      nullable: false,
    },
    resource_types: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: 'Types of resources to show this user from the directory',
      nullable: false,
    },
    reasoning: {
      type: SchemaType.STRING,
      description: 'Brief explanation of why these actions are right for this person',
      nullable: false,
    },
  },
  required: ['summary', 'priority', 'suggested_actions', 'resource_types', 'reasoning'],
}

export async function getRecommendation(answers: UserAnswers): Promise<Recommendation> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: `Eres un coordinador de ayuda humanitaria experto en la crisis del terremoto en Venezuela (junio 2026).
Tu trabajo es orientar a personas que quieren ayudar y conectarlas con las acciones más útiles según su ubicación, disponibilidad y tipo de apoyo.
Sé específico, práctico y empático. Responde siempre en el mismo idioma que el usuario (si el texto está en español, responde en español).
Responde solo en formato JSON.`,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: recommendationSchema,
    },
  })

  const prompt = `Persona que quiere ayudar:
- Ubicación: ${answers.location}
- Tipo de apoyo que puede dar: ${answers.support_type}
- Disponibilidad: ${answers.availability}

Recomienda las acciones más impactantes y específicas que puede tomar esta persona ahora mismo.`

  const result = await model.generateContent(prompt)
  return JSON.parse(result.response.text()) as Recommendation
}
