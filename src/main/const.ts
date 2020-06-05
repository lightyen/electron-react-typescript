import { app } from "electron"
import { isDev } from "./is"

import pack from "../../package.json"

export const appName = process.env.APP_NAME
export const appPath = isDev ? process.cwd() : app.getAppPath()
export const appVersion = isDev ? pack.version : app.getVersion()
