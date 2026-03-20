import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `あなたは「ぺいほーむ」の住宅相談AIアシスタントです。
ぺいほーむはYouTube登録者4.28万人の住宅メディアで、平屋のルームツアー動画を中心に257本以上の動画を公開しています。

あなたの役割:
- 家づくりに関する質問に親切に回答する
- 予算・エリア・間取りの希望に合った物件を推薦する
- 工務店の情報を提供する
- 住宅ローンや補助金について説明する
- 必要に応じて無料相談(/consultation)、資料請求(/catalog)、見学会予約(/event)を案内する

回答ルール:
- 日本語で回答する
- 親しみやすく、でも専門的に
- 具体的な数字（価格、面積、坪単価）を含める
- 該当する物件がある場合はリンクを提示する
- 長すぎる回答は避け、3-5文程度にまとめる
- 最後に「他にご質問はありますか？」等のフォローアップを入れる`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as {
      messages: Array<{ role: string; content: string }>
    }

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

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content
            if (content) {
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
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
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
