'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) throw new Error('Failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ''

      setMessages([...newMessages, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        const lines = text.split('\n').filter(l => l.startsWith('data: '))

        for (const line of lines) {
          const data = line.replace('data: ', '')
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              assistantContent += parsed.content
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                }
                return updated
              })
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'すみません、エラーが発生しました。もう一度お試しください。' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button with Speech Bubble */}
      {!isOpen && (
        <div className="fixed bottom-24 right-5 z-[1000] flex items-end gap-2">
          <div className="relative bg-white rounded-2xl shadow-lg px-4 py-2.5 mb-2 animate-bounce-slow">
            <p className="text-sm font-bold text-[#E8740C] whitespace-nowrap">AIに聞いてみよう！</p>
            <p className="text-[10px] text-gray-400">家づくりの質問に答えます</p>
            <div className="absolute -right-2 bottom-3 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[10px] border-l-white" />
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-[#E8740C] shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center shrink-0 animate-chat-ring"
            aria-label="AIチャットを開く"
          >
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white animate-chat-wiggle">
              <Image src="/images/pei_wink.png" alt="ペイくん" width={36} height={36} className="object-contain" />
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-[1001] w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-[#E8740C] text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center overflow-hidden"><Image src="/images/pei_wink.png" alt="" width={28} height={28} className="object-contain" /></div>
              <div>
                <p className="font-bold text-sm">ぺいほーむ AIアシスタント</p>
                <p className="text-xs opacity-80">家づくりの質問にお答えします</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white text-xl w-8 h-8 flex items-center justify-center">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Image src="/images/pei_smile.png" alt="" width={64} height={64} className="mx-auto mb-3" />
                <p className="text-gray-600 text-sm font-bold mb-2">こんにちは！ぺいほーむです</p>
                <p className="text-gray-400 text-xs mb-4">家づくりについて何でも聞いてください</p>
                <div className="space-y-2">
                  {['鹿児島で2,500万円以内で建てられる平屋を探して', '30坪3LDKの平屋の相場はいくら？', '高断熱・高気密の平屋を紹介して', '住宅ローンの変動と固定どっちがいい？', '鹿児島のおすすめ工務店を教えて'].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); }}
                      className="block w-full text-left px-3 py-2 bg-white rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-[#E8740C] transition border border-gray-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden shrink-0 mr-2 mt-1 border border-orange-200"><Image src="/images/pei_wink.png" alt="" width={22} height={22} className="object-contain" /></div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#E8740C] text-white rounded-br-md'
                      : 'bg-white text-gray-700 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* 考え中インジケーター（ストリーミング開始前に表示） */}
            {isLoading && (messages.length === 0 || messages[messages.length - 1]?.content === '') && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-orange-50 flex items-center justify-center overflow-hidden shrink-0 mr-2 mt-1 border border-orange-200">
                  <Image src="/images/pei_think.png" alt="" width={22} height={22} className="object-contain" />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 bg-[#E8740C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2.5 h-2.5 bg-[#E8740C] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      <span className="w-2.5 h-2.5 bg-[#E8740C] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                    <span className="text-xs text-gray-400 font-medium">ぺいほーむが考えています...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200 shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="メッセージを入力..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-[#E8740C] focus:ring-1 focus:ring-[#E8740C]"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="w-10 h-10 bg-[#E8740C] text-white rounded-full flex items-center justify-center hover:bg-[#D4660A] transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
