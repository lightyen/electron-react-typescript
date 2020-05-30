import log from "electron-log"
import { promises as fs } from "fs"

export const getLog = async () => await fs.readFile(log.transports.file.getFile().path, { encoding: "utf-8" })
