import { IpcRenderer, IpcMain } from "electron"
import { serializeError } from "serialize-error"

const MainNotFoundError = new Error("not support in main process!")
const RendererNotFoundError = new Error("not support in renderer process!")

const pubsub = ".pub/sub"
const reqres = ".req/res"

interface ReturnPayload<T = unknown> {
	data?: T
	error?: Error
}

export class IPC<Payload = unknown, Return = unknown> {
	static ipcRenderer: IpcRenderer = global?.window?.electron?.ipcRenderer
	static ipcMain: IpcMain = global?.electron?.ipcMain
	channel: string
	constructor(channel: string) {
		if (channel == undefined || channel == "") throw new Error("invalid channel name!")
		this.channel = channel
	}

	on(callback: (payload?: Payload) => Promise<void>) {
		if (IPC.ipcRenderer) {
			throw RendererNotFoundError
		}
		IPC.ipcMain?.on(this.channel + pubsub, async (_, payload) => {
			try {
				await callback(payload)
			} catch (err) {
				const error = serializeError(err)
				global.electron.log.error(error)
			}
		})
	}

	send(payload?: Payload) {
		if (IPC.ipcMain) {
			throw MainNotFoundError
		}
		IPC.ipcRenderer?.send(this.channel + pubsub, payload)
	}

	handle(callback: (payload?: Payload) => Promise<Return>) {
		if (IPC.ipcRenderer) {
			throw RendererNotFoundError
		}
		IPC.ipcMain?.handle(this.channel + reqres, async (_, payload) => {
			try {
				const data = await callback(payload)
				console.log(typeof data, data)
				return { data }
			} catch (err) {
				const error = serializeError(err)
				global.electron.log.error(error)
				return { error }
			}
		})
	}

	_invoke(payload?: Payload) {
		console.log("invoke", this.channel + reqres)
		if (IPC.ipcMain) {
			throw MainNotFoundError
		}
		return new Promise<ReturnPayload<Return>>(resolve => {
			IPC.ipcRenderer?.invoke(this.channel + reqres, payload).then(value => resolve(value))
		})
	}
}
