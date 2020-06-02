import { serializeError } from "serialize-error"

interface ReturnPayload<T = unknown> {
	data?: T
	error?: Error
}

const MainNotFoundError = new Error("not support in main process!")
const RendererNotFoundError = new Error("not support in renderer process!")

const pubsub = ".pub/sub"
const reqres = ".req/res"

export function createIPC<Payload = unknown, Return = unknown>(channel: string) {
	if (channel == undefined || channel == "") throw new Error("invalid channel name!")

	return {
		on(callback: (payload?: Payload) => Promise<void> | void) {
			if (globalThis.electron?.ipcRenderer) {
				throw RendererNotFoundError
			}
			return globalThis.ipcMain?.on(channel + pubsub, async (_, payload) => {
				try {
					await callback(payload)
				} catch (err) {
					const error = serializeError(err)
					globalThis.log.error(error)
				}
			})
		},
		send(payload?: Payload) {
			if (globalThis.ipcMain) {
				throw MainNotFoundError
			}
			return globalThis.electron?.ipcRenderer?.send(channel + pubsub, payload)
		},
		handle(callback: (payload?: Payload) => Promise<Return> | Return) {
			if (globalThis.electron?.ipcRenderer) {
				throw RendererNotFoundError
			}
			return globalThis.ipcMain?.handle(channel + reqres, async (_, payload) => {
				try {
					const data = await callback(payload)
					return { data }
				} catch (err) {
					const error = serializeError(err)
					globalThis.log.error(error)
					return { error }
				}
			})
		},
		invoke(payload?: Payload): Promise<ReturnPayload<Return>> {
			if (globalThis.ipcMain) {
				throw MainNotFoundError
			}
			return globalThis.electron?.ipcRenderer?.invoke(channel + reqres, payload)
		},
	}
}
