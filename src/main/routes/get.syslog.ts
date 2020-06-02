import log from "electron-log"
import { promises as fs } from "fs"
import { appLogs } from "shared/ipc"

appLogs.handle(async () => await fs.readFile(log.transports.file.getFile().path, { encoding: "utf-8" }))
