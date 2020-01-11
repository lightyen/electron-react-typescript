import { ipcRenderer, IpcRendererEvent } from "electron"
import { eventChannel, END } from "redux-saga"
import { call } from "redux-saga/effects"

export interface IpcResponse<T = unknown> {
    data?: T
    error?: unknown
}

export function request<T = unknown>(channel: string, ...args: unknown[]) {
    return new Promise<T>((resolve, reject) => {
        ipcRenderer.send(channel, ...args)
        ipcRenderer.once(channel, (event, res) => {
            res.hasOwnProperty("error") ? reject(res.error) : resolve(res.data)
        })
    })
}

export function* subscibeChannel(channel: string) {
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
