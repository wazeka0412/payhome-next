# AI Chat Reference Code from KwaHash/next-pay-home

This file contains all AI chat-related source code extracted from the `KwaHash/next-pay-home` repository for integration reference.

## Architecture Overview

The chat system uses:
- **@assistant-ui/react** - UI component library for chat interfaces
- **OpenAI GPT-4o** - Backend AI model with streaming
- **NDJSON streaming** - Custom streaming protocol between client and server
- **Local runtime** - `useLocalRuntime` with a custom `ChatModelAdapter`

## File Structure

```
app/api/chat/route.ts          - API route (OpenAI streaming endpoint)
features/ai-chat.tsx            - Page-level component (assembles provider + thread)
providers/payhome-runtime-provider.tsx - Runtime provider (ChatModelAdapter + suggestions)
components/thread.tsx           - Main thread UI (messages, composer, welcome)
components/attachment.tsx       - File attachment components
components/markdown-text.tsx    - Markdown rendering for AI responses
components/tool-fallback.tsx    - Tool call display component
components/tooltip-icon-button.tsx - Reusable tooltip button
app/providers.tsx               - App-level providers (Theme + Tooltip)
```

---

## 1. `app/api/chat/route.ts`

```typescript
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: Array<{ role: string; content: string }> }
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages as OpenAI.ChatCompletionMessageParam[],
      stream: true,
    })

    const encoder = new TextEncoder()
    let content = ''
    const toolCalls: Array<{ id?: string; type: string; function: { name: string; arguments: string } }> = []

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta

            if (delta?.content) {
              content += delta.content
            }

            if (delta?.tool_calls) {
              for (const toolCall of delta.tool_calls) {
                if (!toolCalls[toolCall.index]) {
                  toolCalls[toolCall.index] = {
                    id: toolCall.id,
                    type: 'function',
                    function: { name: '', arguments: '' },
                  }
                }
                if (toolCall.function?.name) {
                  toolCalls[toolCall.index].function.name = toolCall.function.name
                }
                if (toolCall.function?.arguments) {
                  toolCalls[toolCall.index].function.arguments += toolCall.function.arguments
                }
              }
            }

            const payload = {
              content: [
                ...(content ? [{ type: 'text' as const, text: content }] : []),
                ...toolCalls.map((tc) => ({
                  type: 'tool-call' as const,
                  toolCallId: tc.id ?? '',
                  toolName: tc.function.name,
                  args: (() => {
                    try {
                      return JSON.parse(tc.function.arguments || '{}')
                    } catch {
                      return {}
                    }
                  })(),
                  argsText: tc.function.arguments || '{}',
                })),
              ],
            }
            controller.enqueue(encoder.encode(JSON.stringify(payload) + '\n'))
          }
        } catch (err) {
          console.error('Chat stream error:', err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-cache' },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Chat request failed' },
      { status: 500 }
    )
  }
}
```

---

## 2. `features/ai-chat.tsx`

```tsx
'use client'

import { Thread } from '@/components/thread'
import { PayhomeRuntimeProvider } from '@/providers/payhome-runtime-provider'

const AIChatPage = () => {
  return (
    <PayhomeRuntimeProvider>
      <div className='flex h-[calc(100dvh-80px)] w-full pr-0.5 overflow-hidden'>
        <div className='flex-1 overflow-hidden'>
          <Thread />
        </div>
      </div>
    </PayhomeRuntimeProvider>
  )
}

export default AIChatPage
```

---

## 3. `providers/payhome-runtime-provider.tsx`

```tsx
'use client'

import {
  AssistantRuntimeProvider,
  Suggestions,
  useAui,
  useLocalRuntime,
  type ChatModelAdapter,
  type ChatModelRunResult
} from '@assistant-ui/react'
import type { ReactNode } from 'react'

function toApiMessage(message: { role: string; content: unknown }) {
  const content = message.content
  return {
    role: message.role,
    content:
      typeof content === 'string'
        ? content
        : Array.isArray(content)
          ? content.map((part: { text?: string }) => part.text ?? '').join('\n')
          : '',
  }
}

const PayHomeModelAdapter: ChatModelAdapter = {
  async *run({ messages, abortSignal }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.map(toApiMessage),
      }),
      signal: abortSignal,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error ?? `Chat request failed (${res.status})`)
    }

    const reader = res.body?.getReader()
    if (!reader) throw new Error('No response body')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        try {
          const payload = JSON.parse(trimmed) as { content: ChatModelRunResult['content'] }
          if (payload.content) {
            yield { content: payload.content } as ChatModelRunResult
          }
        } catch {
          // skip malformed lines
        }
      }
    }

    if (buffer.trim()) {
      try {
        const payload = JSON.parse(buffer.trim()) as { content: ChatModelRunResult['content'] }
        if (payload.content) yield { content: payload.content } as ChatModelRunResult
      } catch {
        // skip
      }
    }
  },
}

export function PayhomeRuntimeProvider({ children }: Readonly<{ children: ReactNode }>) {
  const runtime = useLocalRuntime(PayHomeModelAdapter)

  const aui = useAui({
    suggestions: Suggestions([
      {
        title: '住宅予算',
        label: '家づくりの費用',
        prompt: '家を建てるにはどのくらいの予算が必要ですか？',
      },
      {
        title: '土地探し',
        label: '土地探しのコツ',
        prompt: '土地探しをする際のコツは何ですか？',
      },
      {
        title: '断熱材',
        label: '断熱材の選び方',
        prompt: '家づくりで断熱材を選ぶときのポイントは何ですか？',
      },
      {
        title: '収納計画',
        label: '収納で失敗しない',
        prompt: '収納計画で失敗しないためのポイントは何ですか？',
      },
    ]),
  })

  return (
    <AssistantRuntimeProvider aui={aui} runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  )
}
```

---

## 4. `components/thread.tsx`

```tsx
import { ComposerAddAttachment, ComposerAttachments, UserMessageAttachments } from '@/components/attachment'
import { MarkdownText } from '@/components/markdown-text'
import { ToolFallback } from '@/components/tool-fallback'
import { TooltipIconButton } from '@/components/tooltip-icon-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ActionBarPrimitive,
  AuiIf,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  SuggestionPrimitive,
  ThreadPrimitive,
} from '@assistant-ui/react'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SquareIcon,
} from 'lucide-react'
import type { FC } from 'react'

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className='aui-root aui-thread-root @container flex h-full flex-col bg-background'
      style={{
        ['--thread-max-width' as string]: '44rem',
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor='top'
        className='aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4 scrollbar'
      >
        <AuiIf condition={(s) => s.thread.isEmpty}>
          <ThreadWelcome />
        </AuiIf>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.ViewportFooter className='aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6'>
          <ThreadScrollToBottom />
          <Composer />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  )
}

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip='一番下までスクロール'
        variant='outline'
        className='aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center size-8 rounded-full p-0 disabled:invisible bg-gray-400 hover:bg-gray-500 transition-all duration-300 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-white'
      >
        <ArrowDownIcon aria-hidden />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  )
}

const ThreadWelcome: FC = () => {
  return (
    <div className='aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col'>
      <div className='aui-thread-welcome-center flex w-full grow flex-col items-center justify-center'>
        <div className='aui-thread-welcome-message flex size-full flex-col justify-center px-4 gap-4 text-center max-w-4xl mx-auto'>
          <h1 className='aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both font-semibold text-3xl duration-200'>
            こんにちは！
          </h1>
          <p className='aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in fill-mode-both text-muted-foreground text-base delay-75 duration-200'>
            今日はどのようにお手伝いできますか？
          </p>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  )
}

const ThreadSuggestions: FC = () => {
  return (
    <div className='aui-thread-welcome-suggestions grid w-full md:grid-cols-4 gap-2 pb-4 max-w-4xl mx-auto'>
      <ThreadPrimitive.Suggestions
        components={{
          Suggestion: ThreadSuggestionItem,
        }}
      />
    </div>
  )
}

const ThreadSuggestionItem: FC = () => {
  return (
    <div className='aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 @md:nth-[n+3]:block nth-[n+3]:hidden animate-in fill-mode-both duration-200'>
      <SuggestionPrimitive.Trigger send asChild>
        <Button
          variant='ghost'
          className='aui-thread-welcome-suggestion h-auto w-full md:flex-col flex-wrap items-center justify-center gap-1 rounded-md border px-4 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-gray-800'
        >
          <span className='aui-thread-welcome-suggestion-text-1 text-base font-medium'>
            <SuggestionPrimitive.Title />
          </span>
          <span className='aui-thread-welcome-suggestion-text-2 text-xs text-muted-foreground'>
            <SuggestionPrimitive.Description />
          </span>
        </Button>
      </SuggestionPrimitive.Trigger>
    </div>
  )
}

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className='aui-composer-root relative flex w-full flex-col max-w-4xl mx-auto'>
      <ComposerPrimitive.AttachmentDropzone className='aui-composer-attachment-dropzone flex w-full flex-col rounded-lg border-2 border-input px-1 pt-2 outline-none transition-shadow has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-gray-400 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50'>
        <ComposerAttachments />
        <ComposerPrimitive.Input
          placeholder='メッセージを入力してください...'
          className='aui-composer-input mb-1 max-h-32 min-h-4 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0'
          rows={1}
          autoFocus
          aria-label='Message input'
        />
        <ComposerAction />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  )
}

const ComposerAction: FC = () => {
  return (
    <div className='aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-between'>
      <ComposerAddAttachment />
      <AuiIf condition={(s) => !s.thread.isRunning}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip='メッセージを送信'
            side='bottom'
            type='button'
            variant='default'
            size='icon'
            className='aui-composer-send size-8 rounded-full bg-black/80 hover:bg-black/90'
            aria-label='メッセージを送信'
          >
            <ArrowUpIcon className='aui-composer-send-icon size-4' />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </AuiIf>
      <AuiIf condition={(s) => s.thread.isRunning}>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type='button'
            variant='default'
            size='icon'
            className='aui-composer-cancel size-8 rounded-full bg-black/80 hover:bg-black/90'
            aria-label='Stop generating'
          >
            <SquareIcon className='aui-composer-cancel-icon size-3 fill-current' />
          </Button>
        </ComposerPrimitive.Cancel>
      </AuiIf>
    </div>
  )
}

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className='aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200'>
        <ErrorPrimitive.Message className='aui-message-error-message line-clamp-2' />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  )
}

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className='aui-assistant-message-root fade-in slide-in-from-bottom-1 relative w-full max-w-(--thread-max-width) animate-in py-3 duration-150 max-w-4xl mx-auto'
      data-role='assistant'
    >
      <div className='aui-assistant-message-content wrap-break-word px-2 text-foreground leading-relaxed'>
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </div>
      <div className='aui-assistant-message-footer mt-1 ml-2 flex min-h-6 items-center'>
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  )
}

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide='not-last'
      className='aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground'
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip='コピー' className='hover:bg-black/40 transition-all duration-300'>
          <AuiIf condition={(s) => s.message.isCopied}>
            <CheckIcon />
          </AuiIf>
          <AuiIf condition={(s) => !s.message.isCopied}>
            <CopyIcon />
          </AuiIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip='再読み込み' className='hover:bg-black/40 transition-all duration-300'>
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  )
}

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className='aui-user-message-root fade-in slide-in-from-bottom-1 grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2 max-w-4xl mx-auto'
      data-role='user'
    >
      <UserMessageAttachments />
      <div className='aui-user-message-content-wrapper relative col-start-2 min-w-0'>
        <div className='aui-user-message-content wrap-break-word rounded-2xl bg-muted px-4 py-2.5 text-foreground'>
          <MessagePrimitive.Parts />
        </div>
        <div className='aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2'>
          <UserActionBar />
        </div>
      </div>
      <BranchPicker className='aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end' />
    </MessagePrimitive.Root>
  )
}

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide='not-last'
      className='aui-user-action-bar-root flex flex-col items-end'
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton
          tooltip='編集'
          className='aui-user-action-edit size-9 shrink-0 p-0 hover:bg-gray-300 rounded-full transition-all duration-300 [&>svg]:size-4 [&>svg]:shrink-0 text-foreground'
        >
          <PencilIcon aria-hidden />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  )
}

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root className='aui-edit-composer-wrapper flex w-full max-w-(--thread-max-width) flex-col px-2 py-3 max-w-4xl mx-auto'>
      <ComposerPrimitive.Root className='aui-edit-composer-root ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted'>
        <ComposerPrimitive.Input
          className='aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none'
          autoFocus
        />
        <div className='aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end'>
          <ComposerPrimitive.Cancel asChild>
            <Button
              variant='ghost'
              size='sm'
              className='border border-gray-300 text-gray-900 hover:text-gray-900 bg-white hover:bg-gray-100 rounded-full transition-all duration-300'
            >
              キャンセル
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button
              variant='ghost'
              size='sm'
              className='text-white hover:text-white bg-black hover:bg-black/90 rounded-full transition-all duration-300'
            >
              更新する
            </Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  )
}

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({ className, ...rest }) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        'aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-muted-foreground text-xs',
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip='前へ' className='hover:bg-black/40 transition-all duration-300'>
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className='aui-branch-picker-state font-medium'>
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip='次へ' className='hover:bg-black/40 transition-all duration-300'>
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  )
}
```

---

## 5. `components/attachment.tsx`

```tsx
'use client'

import { TooltipIconButton } from '@/components/tooltip-icon-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  AttachmentPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  useAui,
  useAuiState,
} from '@assistant-ui/react'
import { FileText, PlusIcon, XIcon } from 'lucide-react'
import { PropsWithChildren, useEffect, useState, type FC } from 'react'
import { useShallow } from 'zustand/shallow'

const useFileSrc = (file: File | undefined) => {
  const [src, setSrc] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!file) {
      setSrc(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setSrc(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return src
}

const useAttachmentSrc = () => {
  const { file, src } = useAuiState(
    useShallow((s): { file?: File; src?: string } => {
      if (s.attachment.type !== 'image') return {}
      if (s.attachment.file) return { file: s.attachment.file }
      const src = s.attachment.content?.filter((c) => c.type === 'image')[0]
        ?.image
      if (!src) return {}
      return { src }
    }),
  )
  return useFileSrc(file) ?? src
}

type AttachmentPreviewProps = {
  src: string;
};

const AttachmentPreview: FC<AttachmentPreviewProps> = ({ src }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <img
      src={src}
      alt='Image Preview'
      className={cn(
        'block h-auto max-h-[80vh] w-auto max-w-full object-contain',
        isLoaded
          ? 'aui-attachment-preview-image-loaded'
          : 'aui-attachment-preview-image-loading invisible',
      )}
      onLoad={() => setIsLoaded(true)}
    />
  )
}

const AttachmentPreviewDialog: FC<PropsWithChildren> = ({ children }) => {
  const src = useAttachmentSrc()

  if (!src) return children

  return (
    <Dialog>
      <DialogTrigger
        className='aui-attachment-preview-trigger cursor-pointer transition-colors hover:bg-accent/50'
        asChild
      >
        {children}
      </DialogTrigger>
      <DialogContent className='aui-attachment-preview-dialog-content p-2 sm:max-w-3xl [&>button]:rounded-full [&>button]:bg-foreground/60 [&>button]:p-1 [&>button]:opacity-100 [&>button]:ring-0! [&_svg]:text-background [&>button]:hover:[&_svg]:text-destructive'>
        <DialogTitle className='aui-sr-only sr-only'>
          Image Attachment Preview
        </DialogTitle>
        <div className='aui-attachment-preview relative mx-auto flex max-h-[80dvh] w-full items-center justify-center overflow-hidden bg-background'>
          <AttachmentPreview src={src} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

const AttachmentThumb: FC = () => {
  const isImage = useAuiState((s) => s.attachment.type === 'image')
  const src = useAttachmentSrc()

  return (
    <Avatar className='aui-attachment-tile-avatar h-full w-full rounded-none'>
      <AvatarImage
        src={src}
        alt='Attachment preview'
        className='aui-attachment-tile-image object-cover'
      />
      <AvatarFallback delayMs={isImage ? 200 : 0}>
        <FileText className='aui-attachment-tile-fallback-icon size-8 text-muted-foreground' />
      </AvatarFallback>
    </Avatar>
  )
}

const AttachmentUI: FC = () => {
  const aui = useAui()
  const isComposer = aui.attachment.source === 'composer'
  const isImage = useAuiState((s) => s.attachment.type === 'image')
  const typeLabel = useAuiState((s) => {
    const type = s.attachment.type
    switch (type) {
      case 'image':
        return 'Image'
      case 'document':
        return 'Document'
      case 'file':
        return 'File'
      default:
        return type
    }
  })

  return (
    <Tooltip>
      <AttachmentPrimitive.Root
        className={cn(
          'aui-attachment-root relative',
          isImage && 'aui-attachment-root-composer only:[&>#attachment-tile]:size-24',
        )}
      >
        <AttachmentPreviewDialog>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'aui-attachment-tile size-14 cursor-pointer overflow-hidden rounded-[14px] border bg-muted transition-opacity hover:opacity-75',
                isComposer && 'aui-attachment-tile-composer border-foreground/20',
              )}
              role='button'
              id='attachment-tile'
              aria-label={`${typeLabel} attachment`}
            >
              <AttachmentThumb />
            </div>
          </TooltipTrigger>
        </AttachmentPreviewDialog>
        {isComposer && <AttachmentRemove />}
      </AttachmentPrimitive.Root>
      <TooltipContent side='top'>
        <AttachmentPrimitive.Name />
      </TooltipContent>
    </Tooltip>
  )
}

const AttachmentRemove: FC = () => {
  return (
    <AttachmentPrimitive.Remove asChild>
      <TooltipIconButton
        tooltip='Remove file'
        className='aui-attachment-tile-remove absolute top-1.5 right-1.5 size-3.5 rounded-full bg-white text-muted-foreground opacity-100 shadow-sm hover:bg-white! [&_svg]:text-black hover:[&_svg]:text-destructive'
        side='top'
      >
        <XIcon className='aui-attachment-remove-icon size-3 dark:stroke-[2.5px]' />
      </TooltipIconButton>
    </AttachmentPrimitive.Remove>
  )
}

export const UserMessageAttachments: FC = () => {
  return (
    <div className='aui-user-message-attachments-end col-span-full col-start-1 row-start-1 flex w-full flex-row justify-end gap-2'>
      <MessagePrimitive.Attachments components={{ Attachment: AttachmentUI }} />
    </div>
  )
}

export const ComposerAttachments: FC = () => {
  return (
    <div className='aui-composer-attachments mb-2 flex w-full flex-row items-center gap-2 overflow-x-auto px-1.5 pt-0.5 pb-1 empty:hidden'>
      <ComposerPrimitive.Attachments components={{ Attachment: AttachmentUI }} />
    </div>
  )
}

export const ComposerAddAttachment: FC = () => {
  return (
    <ComposerPrimitive.AddAttachment asChild>
      <TooltipIconButton
        tooltip='Add Attachment'
        side='bottom'
        variant='ghost'
        size='icon'
        className='aui-composer-add-attachment size-8.5 rounded-full p-1 font-semibold text-xs dark:border-muted-foreground/15 dark:hover:bg-muted-foreground/30 hover:bg-black/30'
        aria-label='Add Attachment'
      >
        <PlusIcon className='aui-attachment-add-icon size-5 stroke-[1.5px]' />
      </TooltipIconButton>
    </ComposerPrimitive.AddAttachment>
  )
}
```

---

## 6. `components/markdown-text.tsx`

```tsx
"use client";

import "@assistant-ui/react-markdown/styles/dot.css";

import {
  type CodeHeaderProps,
  MarkdownTextPrimitive,
  unstable_memoizeMarkdownComponents as memoizeMarkdownComponents,
  useIsMarkdownCodeBlock,
} from "@assistant-ui/react-markdown";
import remarkGfm from "remark-gfm";
import { type FC, memo, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { TooltipIconButton } from "@/components/tooltip-icon-button";
import { cn } from "@/lib/utils";

const MarkdownTextImpl = () => {
  return (
    <MarkdownTextPrimitive
      remarkPlugins={[remarkGfm]}
      className="aui-md"
      components={defaultComponents}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const CodeHeader: FC<CodeHeaderProps> = ({ language, code }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="aui-code-header-root mt-2.5 flex items-center justify-between rounded-t-lg border border-border/50 border-b-0 bg-muted/50 px-3 py-1.5 text-xs">
      <span className="aui-code-header-language font-medium text-muted-foreground lowercase">
        {language}
      </span>
      <TooltipIconButton tooltip="Copy" onClick={onCopy}>
        {!isCopied && <CopyIcon />}
        {isCopied && <CheckIcon />}
      </TooltipIconButton>
    </div>
  );
};

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = memoizeMarkdownComponents({
  h1: ({ className, ...props }) => (
    <h1
      className={cn(
        "aui-md-h1 mb-2 scroll-m-20 font-semibold text-base first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }) => (
    <h2
      className={cn(
        "aui-md-h2 mt-3 mb-1.5 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3
      className={cn(
        "aui-md-h3 mt-2.5 mb-1 scroll-m-20 font-semibold text-sm first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }) => (
    <h4
      className={cn(
        "aui-md-h4 mt-2 mb-1 scroll-m-20 font-medium text-sm first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h5: ({ className, ...props }) => (
    <h5
      className={cn(
        "aui-md-h5 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  h6: ({ className, ...props }) => (
    <h6
      className={cn(
        "aui-md-h6 mt-2 mb-1 font-medium text-sm first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "aui-md-p my-2.5 leading-normal first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }) => (
    <a
      className={cn(
        "aui-md-a text-primary underline underline-offset-2 hover:text-primary/80",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "aui-md-blockquote my-2.5 border-muted-foreground/30 border-l-2 pl-3 text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "aui-md-ul my-2 ml-4 list-disc marker:text-muted-foreground [&>li]:mt-1",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "aui-md-ol my-2 ml-4 list-decimal marker:text-muted-foreground [&>li]:mt-1",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr
      className={cn("aui-md-hr my-2 border-muted-foreground/20", className)}
      {...props}
    />
  ),
  table: ({ className, ...props }) => (
    <table
      className={cn(
        "aui-md-table my-2 w-full border-separate border-spacing-0 overflow-y-auto",
        className,
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }) => (
    <th
      className={cn(
        "aui-md-th bg-muted px-2 py-1 text-left font-medium first:rounded-tl-lg last:rounded-tr-lg [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }) => (
    <td
      className={cn(
        "aui-md-td border-muted-foreground/20 border-b border-l px-2 py-1 text-left last:border-r [[align=center]]:text-center [[align=right]]:text-right",
        className,
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }) => (
    <tr
      className={cn(
        "aui-md-tr m-0 border-b p-0 first:border-t [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li className={cn("aui-md-li leading-normal", className)} {...props} />
  ),
  sup: ({ className, ...props }) => (
    <sup
      className={cn("aui-md-sup [&>a]:text-xs [&>a]:no-underline", className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "aui-md-pre overflow-x-auto rounded-t-none rounded-b-lg border border-border/50 border-t-0 bg-muted/30 p-3 text-xs leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  code: function Code({ className, ...props }) {
    const isCodeBlock = useIsMarkdownCodeBlock();
    return (
      <code
        className={cn(
          !isCodeBlock &&
            "aui-md-inline-code rounded-md border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[0.85em]",
          className,
        )}
        {...props}
      />
    );
  },
  CodeHeader,
});
```

---

## 7. `components/tool-fallback.tsx`

```tsx
"use client";

import { memo, useCallback, useRef, useState } from "react";
import {
  AlertCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  LoaderIcon,
  XCircleIcon,
} from "lucide-react";
import {
  useScrollLock,
  type ToolCallMessagePartStatus,
  type ToolCallMessagePartComponent,
} from "@assistant-ui/react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const ANIMATION_DURATION = 200;

export type ToolFallbackRootProps = Omit<
  React.ComponentProps<typeof Collapsible>,
  "open" | "onOpenChange"
> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
};

function ToolFallbackRoot({
  className,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  defaultOpen = false,
  children,
  ...props
}: ToolFallbackRootProps) {
  const collapsibleRef = useRef<HTMLDivElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const lockScroll = useScrollLock(collapsibleRef, ANIMATION_DURATION);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        lockScroll();
      }
      if (!isControlled) {
        setUncontrolledOpen(open);
      }
      controlledOnOpenChange?.(open);
    },
    [lockScroll, isControlled, controlledOnOpenChange],
  );

  return (
    <Collapsible
      ref={collapsibleRef}
      data-slot="tool-fallback-root"
      open={isOpen}
      onOpenChange={handleOpenChange}
      className={cn(
        "aui-tool-fallback-root group/tool-fallback-root w-full rounded-lg border py-3",
        className,
      )}
      style={
        {
          "--animation-duration": `${ANIMATION_DURATION}ms`,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Collapsible>
  );
}

type ToolStatus = ToolCallMessagePartStatus["type"];

const statusIconMap: Record<ToolStatus, React.ElementType> = {
  running: LoaderIcon,
  complete: CheckIcon,
  incomplete: XCircleIcon,
  "requires-action": AlertCircleIcon,
};

function ToolFallbackTrigger({
  toolName,
  status,
  className,
  ...props
}: React.ComponentProps<typeof CollapsibleTrigger> & {
  toolName: string;
  status?: ToolCallMessagePartStatus;
}) {
  const statusType = status?.type ?? "complete";
  const isRunning = statusType === "running";
  const isCancelled =
    status?.type === "incomplete" && status.reason === "cancelled";
  const Icon = statusIconMap[statusType];
  const label = isCancelled ? "Cancelled tool" : "Used tool";

  return (
    <CollapsibleTrigger
      data-slot="tool-fallback-trigger"
      className={cn(
        "aui-tool-fallback-trigger group/trigger flex w-full items-center gap-2 px-4 text-sm transition-colors",
        className,
      )}
      {...props}
    >
      <Icon
        data-slot="tool-fallback-trigger-icon"
        className={cn(
          "aui-tool-fallback-trigger-icon size-4 shrink-0",
          isCancelled && "text-muted-foreground",
          isRunning && "animate-spin",
        )}
      />

      <span
        data-slot="tool-fallback-trigger-label"
        className={cn(
          "aui-tool-fallback-trigger-label-wrapper relative inline-block grow text-left leading-none",
          isCancelled && "text-muted-foreground line-through",
        )}
      >
        <span>
          {label}: <b>{toolName}</b>
        </span>
        {isRunning && (
          <span
            aria-hidden
            data-slot="tool-fallback-trigger-shimmer"
            className="aui-tool-fallback-trigger-shimmer shimmer pointer-events-none absolute inset-0 motion-reduce:animate-none"
          >
            {label}: <b>{toolName}</b>
          </span>
        )}
      </span>

      <ChevronDownIcon
        data-slot="tool-fallback-trigger-chevron"
        className={cn(
          "aui-tool-fallback-trigger-chevron size-4 shrink-0",
          "transition-transform duration-(--animation-duration) ease-out",
          "group-data-[state=closed]/trigger:-rotate-90",
          "group-data-[state=open]/trigger:rotate-0",
        )}
      />
    </CollapsibleTrigger>
  );
}

function ToolFallbackContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CollapsibleContent>) {
  return (
    <CollapsibleContent
      data-slot="tool-fallback-content"
      className={cn(
        "aui-tool-fallback-content relative overflow-hidden text-sm outline-none",
        "group/collapsible-content ease-out",
        "data-[state=closed]:animate-collapsible-up",
        "data-[state=open]:animate-collapsible-down",
        "data-[state=closed]:fill-mode-forwards",
        "data-[state=closed]:pointer-events-none",
        "data-[state=open]:duration-(--animation-duration)",
        "data-[state=closed]:duration-(--animation-duration)",
        className,
      )}
      {...props}
    >
      <div className="mt-3 flex flex-col gap-2 border-t pt-2">{children}</div>
    </CollapsibleContent>
  );
}

function ToolFallbackArgs({
  argsText,
  className,
  ...props
}: React.ComponentProps<"div"> & { argsText?: string }) {
  if (!argsText) return null;
  return (
    <div
      data-slot="tool-fallback-args"
      className={cn("aui-tool-fallback-args px-4", className)}
      {...props}
    >
      <pre className="aui-tool-fallback-args-value whitespace-pre-wrap">
        {argsText}
      </pre>
    </div>
  );
}

function ToolFallbackResult({
  result,
  className,
  ...props
}: React.ComponentProps<"div"> & { result?: unknown }) {
  if (result === undefined) return null;
  return (
    <div
      data-slot="tool-fallback-result"
      className={cn(
        "aui-tool-fallback-result border-t border-dashed px-4 pt-2",
        className,
      )}
      {...props}
    >
      <p className="aui-tool-fallback-result-header font-semibold">Result:</p>
      <pre className="aui-tool-fallback-result-content whitespace-pre-wrap">
        {typeof result === "string"
          ? result
          : JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}

function ToolFallbackError({
  status,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  status?: ToolCallMessagePartStatus;
}) {
  if (status?.type !== "incomplete") return null;
  const error = status.error;
  const errorText = error
    ? typeof error === "string"
      ? error
      : JSON.stringify(error)
    : null;
  if (!errorText) return null;

  const isCancelled = status.reason === "cancelled";
  const headerText = isCancelled ? "Cancelled reason:" : "Error:";

  return (
    <div
      data-slot="tool-fallback-error"
      className={cn("aui-tool-fallback-error px-4", className)}
      {...props}
    >
      <p className="aui-tool-fallback-error-header font-semibold text-muted-foreground">
        {headerText}
      </p>
      <p className="aui-tool-fallback-error-reason text-muted-foreground">
        {errorText}
      </p>
    </div>
  );
}

const ToolFallbackImpl: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const isCancelled =
    status?.type === "incomplete" && status.reason === "cancelled";

  return (
    <ToolFallbackRoot
      className={cn(isCancelled && "border-muted-foreground/30 bg-muted/30")}
    >
      <ToolFallbackTrigger toolName={toolName} status={status} />
      <ToolFallbackContent>
        <ToolFallbackError status={status} />
        <ToolFallbackArgs
          argsText={argsText}
          className={cn(isCancelled && "opacity-60")}
        />
        {!isCancelled && <ToolFallbackResult result={result} />}
      </ToolFallbackContent>
    </ToolFallbackRoot>
  );
};

const ToolFallback = memo(
  ToolFallbackImpl,
) as unknown as ToolCallMessagePartComponent & {
  Root: typeof ToolFallbackRoot;
  Trigger: typeof ToolFallbackTrigger;
  Content: typeof ToolFallbackContent;
  Args: typeof ToolFallbackArgs;
  Result: typeof ToolFallbackResult;
  Error: typeof ToolFallbackError;
};

ToolFallback.displayName = "ToolFallback";
ToolFallback.Root = ToolFallbackRoot;
ToolFallback.Trigger = ToolFallbackTrigger;
ToolFallback.Content = ToolFallbackContent;
ToolFallback.Args = ToolFallbackArgs;
ToolFallback.Result = ToolFallbackResult;
ToolFallback.Error = ToolFallbackError;

export {
  ToolFallback,
  ToolFallbackRoot,
  ToolFallbackTrigger,
  ToolFallbackContent,
  ToolFallbackArgs,
  ToolFallbackResult,
  ToolFallbackError,
};
```

---

## 8. `components/tooltip-icon-button.tsx`

```tsx
"use client";

import { ComponentPropsWithRef, forwardRef } from "react";
import { Slot } from "radix-ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type TooltipIconButtonProps = ComponentPropsWithRef<typeof Button> & {
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
};

export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(({ children, tooltip, side = "bottom", className, ...rest }, ref) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          {...rest}
          className={cn("aui-button-icon size-6 p-1", className)}
          ref={ref}
        >
          <Slot.Slottable>{children}</Slot.Slottable>
          <span className="aui-sr-only sr-only">{tooltip}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
});

TooltipIconButton.displayName = "TooltipIconButton";
```

---

## 9. `app/providers.tsx`

```tsx
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/providers/theme-provider'
import { type PropsWithChildren } from 'react'

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='light'
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </ThemeProvider>
  )
}
```

---

## Key Dependencies

Based on the code, the following npm packages are required for the chat system:

- `@assistant-ui/react` - Core chat UI primitives and runtime
- `@assistant-ui/react-markdown` - Markdown rendering for chat
- `openai` - OpenAI SDK (server-side)
- `remark-gfm` - GitHub Flavored Markdown support
- `lucide-react` - Icons
- `zustand` - State management (used via `useShallow`)
- `radix-ui` - UI primitives (Slot, Dialog, Tooltip, Collapsible)

## Data Flow

1. User types message in `Composer` (thread.tsx)
2. `PayhomeRuntimeProvider` sends message via `PayHomeModelAdapter.run()` to `/api/chat`
3. Server (`route.ts`) calls OpenAI GPT-4o with streaming
4. Server streams NDJSON chunks back with `{ content: [...] }` format
5. Client reads stream, yields `ChatModelRunResult` objects
6. `@assistant-ui/react` updates the thread UI with new messages
7. Assistant messages are rendered with `MarkdownText` component
