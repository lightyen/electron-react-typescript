import Electron from "electron"
import { IpcHandler, IpcPromiseHandler } from "~/ipc"

const getSync: IpcHandler = (e, arg) => {
    return null
}

const doSomething: IpcPromiseHandler = async () => {
    // await ...
    return null
}
