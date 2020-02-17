import { IpcHandler } from "~/ipc"
import { store } from "~/store"

export const setBackgroundColor: IpcHandler = (_, color: string) => {
    store.set("backgroundColor", color)
}

export const setAutoUpdate: IpcHandler = (_, enable: boolean) => {
    store.set("autoUpdate", enable)
}
