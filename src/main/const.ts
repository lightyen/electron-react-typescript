import Electron from "electron"
import { isDev } from "./is"

export const appName = process.env.APP_NAME
export const appPath = isDev ? process.cwd() : Electron.app.getAppPath()
export const appVersion = isDev ? "unknown" : Electron.app.getVersion()
