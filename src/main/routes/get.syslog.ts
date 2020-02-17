import { IpcPromiseHandler } from "~/ipc"
import log from "electron-log"
import { promisify } from "util"
import fs from "fs"

const readFile = promisify(fs.readFile)

export const getLog: IpcPromiseHandler<string> = () =>
    readFile(log.transports.file.getFile().path, { encoding: "utf-8" })
