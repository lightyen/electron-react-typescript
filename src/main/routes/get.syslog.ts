import { promises as fs } from "fs"
import { appLogs } from "shared/ipc"
const log = global.electron.log
appLogs.handle(async () => await fs.readFile(log.transports.file.getFile().path, { encoding: "utf-8" }))
