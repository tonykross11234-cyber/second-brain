export type ContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string }

export interface ApiChatMessage {
  role: 'user' | 'assistant'
  content: string | ContentBlock[]
}

export interface ToolDef {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

export interface AnthropicMessageResponse {
  content: ContentBlock[]
  stop_reason: string
}

interface CallClaudeOptions {
  system?: string
  model?: string
  maxTokens?: number
  tools?: ToolDef[]
}

export async function callClaude(
  messages: ApiChatMessage[],
  options: CallClaudeOptions = {}
): Promise<AnthropicMessageResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages,
      system: options.system,
      model: options.model,
      max_tokens: options.maxTokens,
      tools: options.tools,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    const message = data?.error?.message ?? data?.error ?? `Request failed (${res.status})`
    throw new Error(message)
  }

  if (!Array.isArray(data?.content)) {
    throw new Error('Unexpected response shape from Claude proxy')
  }

  return data as AnthropicMessageResponse
}

export async function askClaude(
  messages: ApiChatMessage[],
  options: Omit<CallClaudeOptions, 'tools'> = {}
): Promise<string> {
  const data = await callClaude(messages, options)
  const text = data.content
    .filter((block): block is { type: 'text'; text: string } => block.type === 'text')
    .map((block) => block.text)
    .join('\n')
    .trim()

  if (!text) {
    throw new Error('Unexpected response shape from Claude proxy')
  }
  return text
}
