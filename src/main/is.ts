import Electron from "electron"
export function isDevMode() {
    return process.env.NODE_ENV === "development" || !Electron.app.isPackaged
}
