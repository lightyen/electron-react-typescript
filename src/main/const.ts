import { app } from "electron"
import { isDev } from "./is"

import pack from "../../package.json"

export const appPath = isDev ? process.cwd() : app.getAppPath()
export const version = isDev ? pack.version : app.getVersion()
