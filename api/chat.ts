interface VercelRequest {
  method?: string
  body?: unknown
}

interface VercelResponse {
  status(code: number): VercelResponse
  setHeader(name: string, value: string): void
  json(body: unknown): void
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: unknown
}

interface ChatRequestBody {
  messages?: ChatMessage[]
  system?: string
  model?: string
  max_tokens?: number
  tools?: unknown[]
  tool_choice?: unknown
}

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const DEFAULT_MAX_TOKENS = 1024
const MAX_TOKENS_CAP = 4096

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY' })
    return
  }

  const body = (req.body ?? {}) as ChatRequestBody
  const { messages, system, model, max_tokens, tools, tool_choice } = body

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: '"messages" must be a non-empty array' })
    return
  }

  const cappedMaxTokens = Math.min(
    typeof max_tokens === 'number' && max_tokens > 0 ? max_tokens : DEFAULT_MAX_TOKENS,
    MAX_TOKENS_CAP
  )

  try {
    const anthropicRes = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: model ?? DEFAULT_MODEL,
        system,
        messages,
        max_tokens: cappedMaxTokens,
        tools,
        tool_choice,
      }),
    })

    const data = await anthropicRes.json()
    res.status(anthropicRes.status).json(data)
  } catch {
    res.status(502).json({ error: 'Failed to reach Anthropic API' })
  }
}
