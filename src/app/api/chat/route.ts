import { handleChatStream } from '@mastra/ai-sdk'
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
import { createUIMessageStreamResponse, type UIMessageChunk } from 'ai'
import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

// Em produção, troque por um ID real de cliente/sessão (ex.: vindo do login
// ou de um identificador de conversa do WhatsApp).
const THREAD_ID = 'cliente-exemplo'
const RESOURCE_ID = 'contador-chat'

export async function POST(req: Request) {
  const params = await req.json()

  const stream = await handleChatStream({
    mastra,
    agentId: 'contador-agent',
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread: THREAD_ID,
        resource: RESOURCE_ID,
      },
    },
  })

  // @mastra/ai-sdk types finishReason with an extra 'unknown' literal that
  // ai's UIMessageChunk doesn't have; the stream shape itself matches.
  return createUIMessageStreamResponse({
    stream: stream as ReadableStream<UIMessageChunk>,
  })
}

export async function GET() {
  const memory = await mastra.getAgentById('contador-agent').getMemory()

  let response = null
  try {
    response = await memory?.recall({
      threadId: THREAD_ID,
      resourceId: RESOURCE_ID,
    })
  } catch {
    console.log('Nenhuma mensagem anterior encontrada.')
  }

  const uiMessages = toAISdkV5Messages(response?.messages || [])
  return NextResponse.json(uiMessages)
}
