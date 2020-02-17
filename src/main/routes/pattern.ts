import Electron from "electron"
import { IpcHandler, IpcPromiseHandler } from "~/ipc"

const getOne: IpcHandler = (e, arg) => {
    return null
}

const getTwo: IpcPromiseHandler = async () => {
    // await ...
    return null
}
