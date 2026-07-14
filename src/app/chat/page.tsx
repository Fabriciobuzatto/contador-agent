'use client'

import { useState } from 'react'
import { DefaultChatTransport } from 'ai'
import { useChat } from '@ai-sdk/react'
import { ArrowUpIcon, SquareIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Message, MessageContent } from '@/components/ui/message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Field, FieldGroup } from '@/components/ui/field'
import { Bubble, BubbleContent } from '@/components/ui/bubble'

export default function ChatPage() {
  const [input, setInput] = useState('')

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const isGenerating = status === 'submitted' || status === 'streaming'

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.()
    if (!input.trim()) return
    sendMessage({ text: input })
    setInput('')
  }

  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col p-6">
      <h1 className="mb-4 text-lg font-semibold text-center">Assistente do Escritório Contábil</h1>

      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              {messages.map((message) => {
                const text =
                  message.parts
                    ?.filter((part) => part.type === 'text')
                    .map((part) => part.text)
                    .join('') ?? ''

                return (
                  <MessageScrollerItem
                    key={message.id}
                    messageId={message.id}
                    scrollAnchor={message.role === 'user'}
                  >
                    <Message align={message.role === 'user' ? 'end' : 'start'}>
                      <MessageContent>
                        <Bubble
                          variant={message.role === 'user' ? 'default' : 'secondary'}
                          align={message.role === 'user' ? 'end' : 'start'}
                        >
                          <BubbleContent>{text}</BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                )
              })}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>

      <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-2">
        <FieldGroup className="max-w-sm">
          <Field>
            <InputGroup>
              <InputGroupTextarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSubmit()
                  }
                }}
                id="block-end-textarea"
                placeholder="Pergunte alguma coisa..."
              />
              <InputGroupAddon align="block-end">
                {isGenerating ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="ml-auto"
                    onClick={stop}
                  >
                    <SquareIcon />
                    <span className="sr-only">Parar</span>
                  </Button>
                ) : (
                  // <Button type="submit" size="icon" disabled={!input.trim()}>
                  //   <ArrowUpIcon />
                  //   <span className="sr-only">Enviar</span>
                  // </Button>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    className="ml-auto"
                    disabled={!input.trim()}
                  >
                    <ArrowUpIcon />
                  </InputGroupButton>
                )}
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
