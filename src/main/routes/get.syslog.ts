import { IpcPromiseHandler } from "~/ipc"
import log from "electron-log"
import { promises as fs } from "fs"

export const getLog: IpcPromiseHandler<string> = () =>
    fs.readFile(log.transports.file.getFile().path, { encoding: "utf-8" })
