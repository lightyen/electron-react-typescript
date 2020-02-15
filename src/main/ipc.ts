import { IpcMainEvent, ipcMain, BrowserWindow, WebContents } from "electron"
import log from "electron-log"
import { serializeError } from "serialize-error"

interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcHandler<T = unknown | void> = (event: IpcMainEvent, ...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcPromiseHandler<T = unknown | void> = (event: IpcMainEvent, ...args: any[]) => Promise<T>

export function response(channel: string, handler: IpcHandler | IpcPromiseHandler) {
    ipcMain.on(channel, (event, ...args) => {
        try {
            const result = handler(event, ...args)
            if (result instanceof Promise) {
                result
                    .then(resp => event.sender.send(channel, { data: resp }))
                    .catch(err => {
                        const error = serializeError(err)
                        log.error(error)
                        event.sender.send(channel, { error })
                    })
                return
            }
            event.sender.send(channel, { data: result })
        } catch (err) {
            const error = serializeError(err)
            log.error(error)
            event.sender.send(channel, { error })
        }
    })
}

export function on(channel: string, handler: IpcHandler | IpcPromiseHandler) {
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

type Sender<T> = (resp: T) => void

export function sendChannel<T = unknown>(e: BrowserWindow | WebContents, channelName: string): Sender<T> {
    return function(resp: T) {
        if (e instanceof BrowserWindow) {
            e.webContents.send(channelName, { data: resp })
        } else {
            e.send(channelName, { data: resp })
        }
    }
}

export default { on, response, sendChannel }
