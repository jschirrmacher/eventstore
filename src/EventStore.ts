import type { LoggerInterface } from "./LoggerInterface"

export type EventType = { name: string }
export type Event = Record<string, unknown>
export type Listener = (event: Event) => void

export type Store = ReturnType<typeof EventStoreFactory>

export default function EventStoreFactory(logger: LoggerInterface = console) {
  const listeners = {} as Record<string, Listener[]>

  return {
    dispatch(event: Event) {
      try {
        const relevantListeners =
          listeners[(event as { type: string }).type] || []
        relevantListeners.forEach(listener => listener(event))
      } catch (error) {
        logger.error((error as Error).message)
        logger.debug((error as Error).stack || "")
      }
    },

    on(type: EventType, func: Listener) {
      listeners[type.name] = listeners[type.name] || []
      listeners[type.name].push(func)
      return this
    }
  }
}
