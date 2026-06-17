import type { IncomingMessage } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001'
const DEFAULT_MAX_TOKENS = 1024
const MAX_TOKENS_CAP = 4096

function readJsonBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => { data += chunk })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

// Dev-only stand-in for the Vercel serverless function at api/chat.ts, so
// `npm run dev` can exercise the AI features without needing `vercel dev`.
function devChatProxy(): Plugin {
  return {
    name: 'dev-chat-proxy',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        const apiKey = process.env.ANTHROPIC_API_KEY
        if (!apiKey) {
          res.statusCode = 500
          res.end(JSON.stringify({ error: 'Server is missing ANTHROPIC_API_KEY (check second-brain/.env)' }))
          return
        }

        try {
          const body = await readJsonBody(req)
          const { messages, system, model, max_tokens, tools, tool_choice } = body as {
            messages?: unknown[]
            system?: string
            model?: string
            max_tokens?: number
            tools?: unknown[]
            tool_choice?: unknown
          }

          if (!Array.isArray(messages) || messages.length === 0) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: '"messages" must be a non-empty array' }))
            return
          }

          const cappedMaxTokens = Math.min(
            typeof max_tokens === 'number' && max_tokens > 0 ? max_tokens : DEFAULT_MAX_TOKENS,
            MAX_TOKENS_CAP
          )

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
          res.statusCode = anthropicRes.status
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(data))
        } catch {
          res.statusCode = 502
          res.end(JSON.stringify({ error: 'Failed to reach Anthropic API' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY

  return {
    plugins: [
      react(),
      devChatProxy(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'Second Brain',
          short_name: 'Second Brain',
          description: 'Daily journal, tasks, and an AI assistant — works offline.',
          theme_color: '#6366f1',
          background_color: '#0b0b0f',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
      }),
    ],
  }
})
