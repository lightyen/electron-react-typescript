import { IpcRendererEvent } from "electron"
const ipcRenderer = window.electron.ipcRenderer

/** IPC response data design pattern */
export interface IpcResponsePattern<T = unknown> {
	data?: T
	error?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send(channel: string, ...args: any[]) {
	ipcRenderer.send(channel, ...args)
}

/** Request to ask for something we need from main process */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function request<T = unknown>(channel: string, ...args: any[]) {
	return new Promise<T>((resolve, reject) => {
		ipcRenderer.send(channel, ...args)
		ipcRenderer.once(channel, (_, res: IpcResponsePattern<T>) => {
			if (res.hasOwnProperty("error")) {
				reject(res.error)
				return
			}
			if (res.hasOwnProperty("data")) {
				resolve(res.data)
				return
			}
			console.error("Unexpected main response format:", JSON.stringify(res))
		})
	})
}

export type SubscribeCallBack<T = unknown> = (e: IpcRendererEvent, res: IpcResponsePattern<T>) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function subscribe<T = any>(channel: string, cb: SubscribeCallBack<T>) {
	ipcRenderer.on(channel, cb)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function unsubscribe<T = any>(channel: string, cb: SubscribeCallBack<T>) {
	ipcRenderer.removeListener(channel, cb)
}
