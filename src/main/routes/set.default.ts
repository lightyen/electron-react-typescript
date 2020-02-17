import { IpcHandler } from "~/ipc"
import store from "~/store"

export const setDefaultBackgroundColor: IpcHandler = (_, color: string) => {
    store.set("backgroundColor", color)
}
