import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'

const SYSTEM_PROMPT = `あなたは「ぺいほーむ」の住宅相談AIアシスタントです。
ぺいほーむはYouTube登録者4.28万人の平屋づくり意思決定プラットフォームで、平屋のルームツアー動画を中心に257本以上の動画を公開しています。

あなたの役割:
- 家づくりに関する質問に親切に回答する
- 予算・エリア・間取りの希望に合った物件や工務店を整理して提案する
- 工務店の情報・得意分野・強みを比較しやすく伝える
- 住宅ローンや補助金について説明する
- 必要に応じて AI家づくり診断(/diagnosis)、無料住宅相談(/consultation)、見学会予約(/event)を案内する
- 会員登録(/signup)で、診断結果の保存・お気に入り・事例ライブラリ全件閲覧・連絡希望条件設定が使えることを必要に応じて伝える

回答ルール:
- 日本語で回答する
- 親しみやすく、でも専門的に
- 具体的な数字（価格、面積、坪単価）を含める
- 該当する物件がある場合はリンクを提示する
- 長すぎる回答は避け、3-5文程度にまとめる
- 最後に「他にご質問はありますか？」等のフォローアップを入れる`

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      messages: Array<{ role: string; content: string }>
      sessionId?: string
      anonymousId?: string
      sourcePage?: string
    }

    const { messages, anonymousId, sourcePage } = body
    let { sessionId } = body

    const supabase = createServerClient()

    // --- セッション管理 ---
    // セッションがなければ新規作成
    if (!sessionId && anonymousId) {
      const firstUserMessage = messages.find(m => m.role === 'user')?.content || ''
      const { data: session } = await supabase
        .from('chat_sessions')
        .insert({
          anonymous_id: anonymousId,
          title: firstUserMessage.slice(0, 50),
          source_page: sourcePage || null,
          message_count: 0,
        })
        .select('id')
        .single()

      if (session) {
        sessionId = session.id
      }
    }

    // --- ユーザーメッセージを保存（ストリーム前） ---
    const latestUserMessage = messages[messages.length - 1]
    if (sessionId && latestUserMessage?.role === 'user') {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'user',
        content: latestUserMessage.content,
      })
    }

    // --- OpenAI ストリーミング ---
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ] as OpenAI.ChatCompletionMessageParam[],
      stream: true,
      temperature: 0.7,
      max_tokens: 1000,
    })

    const encoder = new TextEncoder()
    let fullAssistantContent = ''

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
              fullAssistantContent += content
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
              )
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (err) {
          console.error('Stream error:', err)
        } finally {
          controller.close()

          // --- アシスタント応答を保存（ストリーム後、レスポンスには影響なし） ---
          if (sessionId && fullAssistantContent) {
            const messageCount = messages.length + 1 // user messages + this assistant response
            Promise.all([
              supabase.from('chat_messages').insert({
                session_id: sessionId,
                role: 'assistant',
                content: fullAssistantContent,
              }),
              supabase
                .from('chat_sessions')
                .update({
                  message_count: messageCount,
                  last_message_at: new Date().toISOString(),
                })
                .eq('id', sessionId),
            ]).catch(err => console.error('Chat log save error:', err))
          }
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Chat-Session-Id': sessionId || '',
      },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chat failed' },
      { status: 500 }
    )
  }
}
