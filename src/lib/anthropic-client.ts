export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AskClaudeOptions {
  system?: string
  model?: string
  maxTokens?: number
}

export async function askClaude(messages: ChatMessage[], options: AskClaudeOptions = {}): Promise<string> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages,
      system: options.system,
      model: options.model,
      max_tokens: options.maxTokens,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const message = data?.error?.message ?? data?.error ?? `Request failed (${res.status})`
    throw new Error(message)
  }

  const text = data?.content?.[0]?.text
  if (typeof text !== 'string') {
    throw new Error('Unexpected response shape from Claude proxy')
  }
  return text
}
