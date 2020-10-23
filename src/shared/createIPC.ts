import { serializeError } from "serialize-error"
import { eventChannel, END } from "redux-saga"
import type { Event, IpcMainEvent, IpcMainInvokeEvent, WebContents, IpcRendererEvent } from "electron"

interface Response<T = unknown> {
	data?: T
	error?: Error
}

const MainNotSupportError = (channel: string, method: string) =>
	new Error(`[${channel}].${method}() not support in main process!`)
const RendererNotSupportError = (channel: string, method: string) =>
	new Error(`[${channel}].${method}() not support in renderer process!`)

const pubsub = ".pub/sub"
const reqres = ".req/res"

export const channels = new Set<string>()

export default function createIPC<Message = void, InputParam = void>(channel: string) {
	if (channel == undefined || channel == "") {
		throw new Error("invalid channel")
	}
	if (channels.has(channel)) {
		throw new Error("channel is duplicate")
	}
	channels.add(channel)

	return {
		/**
		 * Listens to `channel`, when a new message arrives `listener` would be called with
		 * `listener(event, payload)`.
		 */
		on(listener: (event: IpcMainEvent | IpcRendererEvent, data: InputParam) => Promise<void> | void) {
			const ipc = globalThis.electron.ipcMain || globalThis.electron.ipcRenderer
			ipc.on(channel + pubsub, async (event: IpcMainEvent | IpcRendererEvent, data: InputParam) => {
				try {
					await listener(event, data)
				} catch (err) {
					const error = serializeError(err)
					globalThis.electron.log.error(error)
				}
			})
		},
		/**
		 * Adds a one time `listener` function for the event. This `listener` is invoked
		 * only the next time a message is sent to `channel`, after which it is removed.
		 */
		once(listener: (event: IpcMainEvent | IpcRendererEvent, data: InputParam) => Promise<void> | void) {
			const ipc = globalThis.electron.ipcMain || globalThis.electron.ipcRenderer
			ipc.once(channel + pubsub, async (event: IpcMainEvent | IpcRendererEvent, data: InputParam) => {
				try {
					await listener(event, data)
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
		send(data: InputParam) {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "send")
			}
			globalThis.electron.ipcRenderer.send(channel + pubsub, data)
		},
		/**
		 * Sends a message to a window with webContentsId via channel.
		 */
		sendTo(webContentsId: number, data: InputParam) {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "send")
			}
			globalThis.electron.ipcRenderer.sendTo(webContentsId, channel + pubsub, data)
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
		handle(listener: (event: IpcMainInvokeEvent, data: InputParam) => Promise<Message> | Message) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError(channel, "handle")
			}
			globalThis.electron.ipcMain.handle(
				channel + reqres,
				async (event, payload: InputParam): Promise<Response<Message>> => {
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
		async invoke(payload: InputParam): Promise<Message> {
			if (globalThis.electron.ipcMain) {
				throw MainNotSupportError(channel, "invoke")
			}
			const { data, error }: Response<Message> = await globalThis.electron.ipcRenderer.invoke(
				channel + reqres,
				payload,
			)
			if (error) {
				throw error
			}
			return data
		},
		sendWithWebContents(webContents: WebContents, data: Message) {
			if (globalThis.electron.ipcRenderer) {
				throw RendererNotSupportError(channel, "sendWithWebContents")
			}
			webContents.send(channel + pubsub, { data })
		},
		saga() {
			if (globalThis.electron.ipcRenderer) {
				return eventChannel<Message | Error | "">(emitter => {
					const callback = (_: Event, res: Response<Message> = {}) => {
						if (Object.prototype.hasOwnProperty.call(res, "error")) {
							emitter(res.error)
						} else if (Object.prototype.hasOwnProperty.call(res, "data")) {
							emitter(res.data)
						} else {
							globalThis.electron.log.error(
								"[%s] Unexpected response format:",
								channel,
								JSON.stringify(res),
							)
							emitter(END)
						}
					}
					globalThis.electron.ipcRenderer.on(channel + pubsub, callback)
					return () => globalThis.electron.ipcRenderer.removeListener(channel + pubsub, callback)
				})
			}
			// main
			return eventChannel<InputParam | unknown>(emitter => {
				const callback = (_: Event, data: InputParam) => {
					emitter(data || {})
				}
				globalThis.electron.ipcMain.on(channel + pubsub, callback)
				return () => globalThis.electron.ipcMain.removeListener(channel + pubsub, callback)
			})
		},
		sagaOnce() {
			if (globalThis.electron.ipcRenderer) {
				return eventChannel<Message | Error | "">(emitter => {
					const callback = (_: Event, res: Response<Message> = {}) => {
						if (Object.prototype.hasOwnProperty.call(res, "error")) {
							emitter(res.error)
						} else if (Object.prototype.hasOwnProperty.call(res, "data")) {
							emitter(res.data)
						} else {
							globalThis.electron.log.error(
								"[%s] Unexpected response format:",
								channel,
								JSON.stringify(res),
							)
						}
						emitter(END)
					}
					globalThis.electron.ipcRenderer.once(channel + pubsub, callback)
					return () => globalThis.electron.ipcRenderer.removeListener(channel + pubsub, callback)
				})
			}
			// main
			return eventChannel<InputParam | unknown>(emitter => {
				const callback = (_: Event, data: InputParam) => {
					emitter(data || {})
					emitter(END)
				}
				globalThis.electron.ipcMain.once(channel + pubsub, callback)
				return () => globalThis.electron.ipcMain.removeListener(channel + pubsub, callback)
			})
		},
	}
}
