import { IpcMainEvent, ipcMain, BrowserWindow, WebContents } from "electron"
import log from "electron-log"
import { serializeError } from "serialize-error"
import { EventEmitter } from "events"

export interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

export type IpcHandler<T = unknown> = (event: IpcMainEvent, ...args: unknown[]) => IpcResponse<T>

export type IpcPromiseHandler<T = unknown> = (event: IpcMainEvent, ...args: unknown[]) => Promise<IpcResponse<T>>

/** subscribe on the ipc channel */
function on(channel: string, handler: IpcHandler | IpcPromiseHandler) {
    ipcMain.on(channel, (event, ...args) => {
        try {
            const result = handler(event, ...args)
            if (result instanceof Promise) {
                result
                    .then(resp => event.sender.send(channel, resp))
                    .catch(err => {
                        const error = serializeError(err)
                        log.error(error)
                        event.sender.send(channel, { error })
                    })
                return
            }
            event.sender.send(channel, result)
        } catch (err) {
            // const error = serializeError(err)
            // log.error(error)
            // event.sender.send(channel, { error })
        }
    })
}

type Sender<T> = (channel: string, resp: IpcResponse<T>) => void

function sender<ResponseData = unknown>(e: BrowserWindow | WebContents): Sender<ResponseData> {
    return function(channel: string, resp: IpcResponse<ResponseData>) {
        if (e instanceof BrowserWindow) {
            e.webContents.send(channel, resp)
        } else {
            e.send(channel, resp)
        }
    }
}

const send = (e: BrowserWindow | WebContents) => (channel: string, resp: IpcResponse) => {
    if (e instanceof BrowserWindow) {
        e.webContents.send(channel, resp)
    } else {
        e.send(channel, resp)
    }
}

export default { on, sender }
