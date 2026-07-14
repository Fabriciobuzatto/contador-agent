import Link from 'next/link'

export default function Home() {
  return (
    <div className="mx-auto max-w-140 p-6">
      <h1 className="mb-3 text-[22px] font-semibold">
        Exemplo: agente Mastra + Next.js
      </h1>
      <p className="mb-4">
        Vá até <Link href="/chat">/chat</Link> pra conversar com o assistente
        do escritório contábil.
      </p>
    </div>
  )
}
