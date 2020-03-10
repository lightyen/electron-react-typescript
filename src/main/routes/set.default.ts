import { IpcHandler } from "~/ipc"
import { storage } from "~/store"

export const setBackgroundColor: IpcHandler = (_, color: string) => {
    storage.set("backgroundColor", color)
}

export const setAutoUpdate: IpcHandler = (_, enable: boolean) => {
    storage.set("autoUpdate", enable)
}
