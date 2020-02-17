import { IpcHandler } from "~/ipc"
import os from "os"

export const getMemory: IpcHandler = () => {
    return {
        free: os.freemem(),
        total: os.totalmem(),
    }
}
