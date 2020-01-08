import { ipcMain, IpcMainEvent } from "electron"

export interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

export type IpcHandler<T = unknown> = (event: IpcMainEvent, ...args: unknown[]) => IpcResponse<T>
export type IpcPromiseHandler<T = unknown> = (event: IpcMainEvent, ...args: unknown[]) => Promise<IpcResponse<T>>

function on(channel: string, handler: IpcHandler | IpcPromiseHandler) {
    ipcMain.on(channel, (event, ...args) => {
        const o = handler(event, ...args)
        if (o instanceof Promise) {
            o.then(res => event.sender.send(channel, res))
            return
        }
        event.sender.send(channel, o)
    })
}

function subscribe(channel: string, handler: IpcHandler | IpcPromiseHandler) {
    ipcMain.on(channel, (event, ...args) => handler(event, ...args))
}

const send = (e: Electron.WebContents) => (channel: string, resp: IpcResponse) => e.send(channel, resp)

export default { on, subscribe, send }
