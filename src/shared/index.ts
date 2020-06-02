import { serializeError } from "serialize-error"
import { eventChannel } from "redux-saga"

import type { IpcRendererEvent, IpcMainEvent, IpcMainInvokeEvent, WebContents } from "electron"

interface ReturnPayload<T = unknown> {
	data?: T
	error?: Error
}

type SubscribeCallBack<T = unknown> = (e: IpcRendererEvent, res: ReturnPayload<T>) => void

const MainNotSupportError = new Error("not support in main process!")
const RendererNotSupportError = new Error("not support in renderer process!")

const pubsub = ".pub/sub"
const reqres = ".req/res"

export function createIPC<Payload = unknown, Return = unknown>(channel: string) {
	if (channel == undefined || channel == "") throw new Error("invalid channel name!")

	return {
		on(callback: (e: IpcMainEvent, payload?: Payload) => Promise<void> | void) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError
			}
			return globalThis.electron.ipcMain?.on(channel + pubsub, async (e, payload) => {
				try {
					await callback(e, payload)
				} catch (err) {
					const error = serializeError(err)
					globalThis.log.error(error)
				}
			})
		},
		send(payload?: Payload) {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError
			}
			return globalThis.electron.ipcRenderer?.send(channel + pubsub, payload)
		},

		handle(callback: (e: IpcMainInvokeEvent, payload?: Payload) => Promise<Return> | Return) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError
			}
			return globalThis.electron.ipcMain?.handle(channel + reqres, async (e, payload) => {
				try {
					const data = await callback(e, payload)
					return { data }
				} catch (err) {
					const error = serializeError(err)
					globalThis.log.error(error)
					return { error }
				}
			})
		},
		async invoke(payload?: Payload): Promise<Return> {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError
			}
			const { data, error } = await globalThis.electron.ipcRenderer?.invoke(channel + reqres, payload)
			if (error) {
				throw error
			}
			return data
		},

		sendWithWebContents(webContents: WebContents, payload?: Payload) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError
			}
			webContents.send(channel + pubsub, { data: payload })
		},
		sagaEventChannel() {
			return eventChannel(emitter => {
				const callback: SubscribeCallBack = (_, res) => {
					if (Object.prototype.hasOwnProperty.call(res, "error")) {
						emitter(res.error)
						return
					}
					if (Object.prototype.hasOwnProperty.call(res, "data")) {
						emitter(res.data)
						return
					}
					console.error("Unexpected response format:", JSON.stringify(res))
				}
				globalThis.electron.ipcRenderer?.on(channel + pubsub, callback)
				return () => globalThis.electron.ipcRenderer?.removeListener(channel + pubsub, callback)
			})
		},
	}
}
