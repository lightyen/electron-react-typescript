import { IpcMainEvent, ipcMain, BrowserWindow, WebContents } from "electron"
import log from "electron-log"
import { serializeError } from "serialize-error"

interface IpcResponsePattern<T = unknown> {
    data?: T
    error?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcHandler<T = any> = (event: IpcMainEvent, ...args: any[]) => T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IpcPromiseHandler<T = any> = (event: IpcMainEvent, ...args: any[]) => Promise<T>

export function response(channel: string, handler: IpcHandler | IpcPromiseHandler) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send<T = any>(e: BrowserWindow | WebContents, channelName: string, resp: T) {
    if (resp == undefined) {
        return
    }
    if (e instanceof BrowserWindow) {
        e.webContents.send(channelName, { data: resp })
    } else {
        e.send(channelName, { data: resp })
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendChannel<T = any>(e: BrowserWindow | WebContents, channelName: string): (resp: T) => void {
    return function(resp: T) {
        if (resp == undefined) {
            return
        }
        if (e instanceof BrowserWindow) {
            e.webContents.send(channelName, { data: resp })
        } else {
            e.send(channelName, { data: resp })
        }
    }
}

export default { on, response, send, sendChannel }
