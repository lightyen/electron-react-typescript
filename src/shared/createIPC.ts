import { serializeError } from "serialize-error"
import { eventChannel } from "redux-saga"

import type { IpcRendererEvent, IpcMainEvent, IpcMainInvokeEvent, WebContents } from "electron"

interface ReturnPayload<T = unknown> {
	data?: T
	error?: Error
}

const MainNotSupportError = (channel: string, method: string) =>
	new Error(`[${channel}].${method}() not support in main process!`)
const RendererNotSupportError = (channel: string, method: string) =>
	new Error(`[${channel}].${method}() not support in renderer process!`)

const pubsub = ".pub/sub"
const reqres = ".req/res"

const channelSet = new Set<string>()

export default function createIPC<Payload = unknown, Return = unknown>(channel: string) {
	if (channel == undefined || channel == "") {
		throw new Error("invalid channel name!")
	}
	if (channelSet.has(channel)) {
		throw new Error("channel name is duplicate!")
	}
	channelSet.add(channel)

	return {
		/**
		 * Listens to `channel`, when a new message arrives `listener` would be called with
		 * `listener(event, payload)`.
		 */
		on(listener: (event: IpcMainEvent, payload?: Payload) => Promise<void> | void) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError(channel, "on")
			}
			globalThis.electron.ipcMain?.on(channel + pubsub, async (event, payload) => {
				try {
					await listener(event, payload)
				} catch (err) {
					const error = serializeError(err)
					globalThis.electron.log.error(error)
				}
			})
		},
		/**
		 * Send an asynchronous message to the main process via `channel`, along with
		 * payload. Payload will be serialized with the Structured Clone Algorithm,
		 * just like `postMessage`, so prototype chains will not be included. Sending
		 * Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an exception.
		 *
		 * > **NOTE**: Sending non-standard JavaScript types such as DOM objects or special
		 * Electron objects is deprecated, and will begin throwing an exception starting
		 * with Electron 9.
		 */
		send(payload?: Payload) {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "send")
			}
			globalThis.electron.ipcRenderer?.send(channel + pubsub, payload)
		},
		/**
		 * Adds a handler for an `invoke`able IPC. This handler will be called whenever a
		 * renderer calls `invoke(payload)`.
		 *
		 * If `listener` returns a Promise, the eventual result of the promise will be
		 * returned as a reply to the remote caller. Otherwise, the return value of the
		 * listener will be used as the value of the reply.
		 *
		 * The `event` that is passed as the first argument to the handler is the same as
		 * that passed to a regular event listener. It includes information about which
		 * WebContents is the source of the invoke request.
		 */
		handle(listener: (event: IpcMainInvokeEvent, payload?: Payload) => Promise<Return> | Return) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError(channel, "handle")
			}
			globalThis.electron.ipcMain?.handle(
				channel + reqres,
				async (event, payload): Promise<ReturnPayload> => {
					try {
						const data = await listener(event, payload)
						return { data }
					} catch (err) {
						const error = serializeError(err)
						globalThis.electron.log.error(error)
						return { error }
					}
				},
			)
		},
		/**
		 * Resolves with the response from the main process.
		 *
		 * Send a message to the main process via `channel` and expect a result
		 * asynchronously. Payload will be serialized with the Structured Clone
		 * Algorithm, just like `postMessage`, so prototype chains will not be included.
		 * Sending Functions, Promises, Symbols, WeakMaps, or WeakSets will throw an
		 * exception.
		 *
		 * > **NOTE**: Sending non-standard JavaScript types such as DOM objects or special
		 * Electron objects is deprecated, and will begin throwing an exception starting
		 * with Electron 9.
		 */
		async invoke(payload?: Payload): Promise<Return> {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "invoke")
			}
			const { data, error } = await globalThis.electron.ipcRenderer?.invoke(channel + reqres, payload)
			if (error) {
				throw error
			}
			return data
		},

		sendWithWebContents(webContents: WebContents, payload?: Payload) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError(channel, "sendWithWebContents")
			}
			webContents.send(channel + pubsub, { data: payload })
		},
		sagaEventChannel() {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "sagaEventChannel")
			}
			return eventChannel(emitter => {
				const callback = (e: IpcRendererEvent, res: ReturnPayload) => {
					if (Object.prototype.hasOwnProperty.call(res, "error")) {
						emitter(res.error)
						return
					}
					if (Object.prototype.hasOwnProperty.call(res, "data")) {
						emitter(res.data)
						return
					}
					globalThis.electron.log.error("[%s] Unexpected response format:", channel, JSON.stringify(res))
				}
				globalThis.electron.ipcRenderer?.on(channel + pubsub, callback)
				return () => globalThis.electron.ipcRenderer?.removeListener(channel + pubsub, callback)
			})
		},
	}
}
