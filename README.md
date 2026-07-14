# Contador Agent

Assistente virtual para um escritório de contabilidade, construído com [Next.js](https://nextjs.org) e [Mastra](https://mastra.ai). O agente responde dúvidas sobre prazos de declaração de imposto de renda, documentos necessários e horário de atendimento.

## Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) (o projeto usa `pnpm-lock.yaml`)
- Uma chave de API da OpenAI (o agente usa o modelo `openai/gpt-5.5`)

## Configuração

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Copie o arquivo de variáveis de ambiente e preencha sua chave da OpenAI:

   ```bash
   cp .env.example .env
   ```

   ```
   OPENAI_API_KEY=sua-chave-aqui
   ```

## Rodando o projeto

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador. A partir dali, acesse [http://localhost:3000/chat](http://localhost:3000/chat) para conversar com o assistente.

Outros comandos disponíveis:

```bash
pnpm build   # build de produção
pnpm start   # roda o build de produção
pnpm lint    # checagem de lint
```

## Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # página inicial
│   ├── chat/page.tsx         # tela de chat com o assistente
│   └── api/chat/route.ts     # endpoint que conecta o front ao agente Mastra
├── components/ui/            # componentes de UI (shadcn)
├── lib/                      # utilitários
└── mastra/
    ├── index.ts              # instância principal do Mastra
    └── agents/
        └── contador-agent.ts # definição do agente (instruções, modelo)
```

## Como funciona a conversa

O chat usa o hook `useChat` (AI SDK) no cliente, que mantém o histórico da conversa em memória no navegador e o reenvia a cada mensagem para `/api/chat`. Esse endpoint repassa as mensagens para o `contadorAgent` via `handleChatStream` e transmite a resposta de volta em streaming.

Esse histórico não é persistido em banco de dados — ele existe apenas enquanto a página do navegador está aberta. Para adicionar memória persistente entre sessões, é necessário configurar `@mastra/memory` com um storage provider e associá-lo ao agente em `src/mastra/agents/contador-agent.ts`.

## Personalizando o agente

As instruções, regras de resposta e modelo do assistente ficam em [src/mastra/agents/contador-agent.ts](src/mastra/agents/contador-agent.ts). Edite o campo `instructions` para ajustar o comportamento do assistente.
