import { IpcMainEvent, ipcMain, BrowserWindow, WebContents } from "electron"
import log from "electron-log"
import { serializeError } from "serialize-error"

/** IPC response data design pattern */
interface IpcResponsePattern<T = unknown> {
	data?: T
	error?: unknown
}

type IpcHandler<T> = (event: IpcMainEvent, ...args: any[]) => T

type IpcPromiseHandler<T> = (event: IpcMainEvent, ...args: any[]) => Promise<T>

type Handler<T = (event: IpcMainEvent, ...args: any[]) => unknown> = T extends IpcHandler<infer P>
	? IpcHandler<P>
	: T extends IpcPromiseHandler<infer Q>
	? IpcPromiseHandler<Q>
	: never

export function response<H extends Handler>(channel: string, handler: H) {
	ipcMain.on(channel, (event, ...args) => {
		try {
			const result = handler(event, ...args)
			if (result instanceof Promise) {
				result
					.then(resp => resp != undefined && event.sender.send(channel, { data: resp }))
					.catch(err => {
						const error = serializeError(err)
						log.error(error)
						event.sender.send(channel, { error })
					})
				return
			}
			result != undefined && event.sender.send(channel, { data: result })
		} catch (err) {
			const error = serializeError(err)
			log.error(error)
			event.sender.send(channel, { error })
		}
	})
}

export function on<T>(channel: string, handler: IpcHandler<T> | IpcPromiseHandler<T>) {
	ipcMain.on(channel, (event, ...args) => {
		try {
			const result = handler(event, ...args)
			if (result instanceof Promise) {
				result.catch(err => {
					const error = serializeError(err)
					log.error(error)
				})
				return
			}
		} catch (err) {
			const error = serializeError(err)
			log.error(error)
		}
	})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send<T = any>(channel: string, data: T, e?: WebContents) {
	if (data == undefined) {
		return
	}
	if (e) {
		e.send(channel, { data })
		return
	}
	BrowserWindow.getFocusedWindow()?.webContents.send(channel, { data })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function request<T = any>(e: WebContents, channel: string, ...args: any[]) {
	return new Promise((resolve: (value: T) => void, reject) => {
		ipcMain.once(channel, (_, res: IpcResponsePattern<T>) => {
			if (Object.prototype.hasOwnProperty.call(res, "error")) {
				reject(res.error)
				return
			}
			if (Object.prototype.hasOwnProperty.call(res, "data")) {
				resolve(res.data)
				return
			}
			log.error("Unexpected renderer response format:", JSON.stringify(res))
		})
		e.send(channel, ...args)
	})
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendChannel<T = any>(channel: string, e?: WebContents): (data: T) => void {
	return function (data: T) {
		if (data == undefined) {
			return
		}
		if (e) {
			e.send(channel, { data })
			return
		}
		BrowserWindow.getFocusedWindow()?.webContents.send(channel, { data })
	}
}

export default { on, response, send, sendChannel }
