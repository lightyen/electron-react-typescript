import { ipcRenderer, IpcRendererEvent } from "electron"
import { eventChannel, END } from "redux-saga"
import { call } from "redux-saga/effects"

/** IPC response data design pattern */
export interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

/** Request to ask for something we need from main process */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function request<T = unknown>(channel: string, ...args: any[]) {
    return new Promise<T>((resolve, reject) => {
        ipcRenderer.send(channel, ...args)
        ipcRenderer.once(channel, (event, res) => {
            res.hasOwnProperty("error") ? reject(res.error) : resolve(res.data)
        })
    })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args)
}

/** Create redux-saga channel from electron main process */
export function* subscribeChannel(channel: string) {
    return yield call(() =>
        eventChannel(emitter => {
            function cb(e: IpcRendererEvent, res: IpcResponse) {
                if (res.hasOwnProperty("error")) {
                    emitter(res.error)
                    emitter(END)
                    return
                }
                emitter(res.data)
            }
            ipcRenderer.on(channel, cb)
            return () => ipcRenderer.removeListener(channel, cb)
        }),
    )
}

/** redux-saga channel console */
export function* consoleChannel(channel: string) {
    return yield call(() =>
        eventChannel(emitter => {
            function cb(e: IpcRendererEvent, res: unknown) {
                emitter(res)
            }
            ipcRenderer.on(channel, cb)
            return () => ipcRenderer.removeListener(channel, cb)
        }),
    )
}
