import { Mastra } from '@mastra/core'
import { contadorAgent } from './agents/contador-agent'

export const mastra = new Mastra({
  agents: { contadorAgent },
})
