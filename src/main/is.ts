import Electron from "electron"
export const isDev = process.env.NODE_ENV === "development" || !Electron.app.isPackaged
