import Electron from "electron"
import { isDevMode } from "./is"

export const appPath = isDevMode() ? process.cwd() : Electron.app.getAppPath()
export const appName = process.env.APP_NAME
export const appVersion = isDevMode() ? "unknown" : Electron.app.getVersion()
