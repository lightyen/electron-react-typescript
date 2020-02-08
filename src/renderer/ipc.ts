import { ipcRenderer, IpcRendererEvent } from "electron"
import { eventChannel, END } from "redux-saga"
import { call } from "redux-saga/effects"

/** IPC response data design pattern */
export interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

/** Request to ask for something we need from main process */
export function request<T = unknown>(channel: string, ...args: unknown[]) {
    return new Promise<T>((resolve, reject) => {
        ipcRenderer.send(channel, ...args)
        ipcRenderer.once(channel, (event, res) => {
            res.hasOwnProperty("error") ? reject(res.error) : resolve(res.data)
        })
    })
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
