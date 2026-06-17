import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEntriesStore } from '../store/useEntriesStore'
import { useTasksStore } from '../store/useTasksStore'
import { useProfileStore } from '../store/useProfileStore'
import { useChatStore } from '../store/useChatStore'
import { useFitnessStore } from '../store/useFitnessStore'
import { useTranslation } from '../lib/useTranslation'
import { callClaude } from '../lib/anthropic-client'
import { buildSystemPrompt } from '../lib/chat-context'
import { CHAT_TOOLS, executeChatTool } from '../lib/chat-tools'
import type { ApiChatMessage, ContentBlock } from '../lib/anthropic-client'
import type { Profile } from '../lib/types'
import styles from './ChatScreen.module.css'

export function ChatScreen() {
  const { t, language } = useTranslation()
  const entries = useEntriesStore((s) => s.entries)
  const tasks = useTasksStore((s) => s.tasks)
  const profileName = useProfileStore((s) => s.name)
  const profileWeight = useProfileStore((s) => s.weightKg)
  const profileHeight = useProfileStore((s) => s.heightCm)
  const profileAge = useProfileStore((s) => s.age)
  const profilePinEnabled = useProfileStore((s) => s.pinEnabled)
  const profilePinCode = useProfileStore((s) => s.pinCode)
  const profilePinOffered = useProfileStore((s) => s.pinSetupOffered)
  const profile: Profile = {
    name: profileName,
    weightKg: profileWeight,
    heightCm: profileHeight,
    age: profileAge,
    pinEnabled: profilePinEnabled,
    pinCode: profilePinCode,
    pinSetupOffered: profilePinOffered,
  }
  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)
  const clearHistory = useChatStore((s) => s.clearHistory)

  const getTodayFitness = useFitnessStore((s) => s.getTodayData)
  const fitnessGoals = useFitnessStore((s) => s.goals)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function buildApiHistory(): ApiChatMessage[] {
    return messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.text }))
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setLoading(true)
    addMessage('user', text)
    scrollToBottom()

    const systemPrompt = buildSystemPrompt(language, profile, entries, tasks, getTodayFitness(), fitnessGoals)
    let apiMessages: ApiChatMessage[] = [
      ...buildApiHistory(),
      { role: 'user', content: text },
    ]

    try {
      for (let i = 0; i < 4; i++) {
        const response = await callClaude(apiMessages, {
          system: systemPrompt,
          tools: CHAT_TOOLS,
          maxTokens: 1024,
        })

        const toolBlocks = response.content.filter(
          (b): b is { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } =>
            b.type === 'tool_use'
        )
        const textBlocks = response.content.filter(
          (b): b is { type: 'text'; text: string } => b.type === 'text'
        )

        if (toolBlocks.length === 0) {
          const assistantText = textBlocks.map((b) => b.text).join('\n').trim()
          if (assistantText) addMessage('assistant', assistantText)
          scrollToBottom()
          break
        }

        const toolResults: ContentBlock[] = toolBlocks.map((b) => ({
          type: 'tool_result' as const,
          tool_use_id: b.id,
          content: executeChatTool(b.name, b.input),
        }))

        const actionText = toolResults
          .map((r) => (r.type === 'tool_result' ? r.content : ''))
          .filter(Boolean)
          .join(' · ')
        if (actionText) addMessage('action', actionText)

        apiMessages = [
          ...apiMessages,
          { role: 'assistant', content: response.content },
          { role: 'user', content: toolResults },
        ]

        if (response.stop_reason === 'end_turn' && textBlocks.length > 0) {
          const assistantText = textBlocks.map((b) => b.text).join('\n').trim()
          if (assistantText) addMessage('assistant', assistantText)
          scrollToBottom()
          break
        }
      }
    } catch {
      addMessage('assistant', t.chat.error)
      scrollToBottom()
    } finally {
      setLoading(false)
    }
  }

  function handleClear() {
    if (window.confirm(t.chat.clearConfirm)) clearHistory()
  }

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        <h1>{t.chat.title}</h1>
        {messages.length > 0 && (
          <button type="button" className={styles.clearButton} onClick={handleClear}>
            {t.chat.clear}
          </button>
        )}
      </header>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>{t.chat.emptyTitle}</p>
            <p className={styles.emptyBody}>{t.chat.emptyBody}</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`${styles.bubble} ${styles[msg.role]}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {msg.text}
              </motion.div>
            ))}
            {loading && (
              <motion.div
                key="thinking"
                className={`${styles.bubble} ${styles.assistant} ${styles.thinking}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18 }}
              >
                {t.chat.thinking}
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputBar}>
        <input
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.chat.placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
          disabled={loading}
        />
        <motion.button
          type="button"
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!input.trim() || loading}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </motion.button>
      </div>
    </div>
  )
}
