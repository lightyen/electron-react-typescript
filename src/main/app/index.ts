import Electron from "electron"
import { MainWindow } from "./window"
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"

export function isDevMode() {
    return !Electron.app.isPackaged
}

export const appPath = isDevMode() ? process.cwd() : Electron.app.getAppPath()
export const appName = process.env.APP_NAME

export let mainWindow: Electron.BrowserWindow

export function initWindow() {
    mainWindow = new MainWindow()
    mainWindow.on("closed", () => {
        mainWindow = null
    })
    return mainWindow
}

// app.disableHardwareAcceleration()

// NOTE: https://github.com/electron/electron/issues/19468
Electron.app.on("ready", () => {
    // if (isDevMode()) {
    //     installExtension(REACT_DEVELOPER_TOOLS)
    //         .then(name => console.log(`Added Extension: ${name}`))
    //         .catch(err => console.error("An error occurred: ", err))
    // }
    initWindow()
})

Electron.app.on("activate", () => {
    if (!mainWindow) {
        initWindow()
    }
})

Electron.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        Electron.app.quit()
    }
})

export class RendererConsole {
    /** 輸出偵錯訊息到 renderer console (It won't show in development mode.) */
    public static log(message?: unknown, ...optionalParams: unknown[]) {
        if (isDevMode()) {
            mainWindow.webContents.send("console.log", { message, optionalParams })
        }
    }

    /** 輸出警告訊息到 renderer console (It won't show in development mode.) */
    public static warn(message?: unknown, ...optionalParams: unknown[]) {
        if (isDevMode()) {
            mainWindow.webContents.send("console.warn", { message, optionalParams })
        }
    }

    /** 輸出錯誤訊息到 renderer console */
    public static error(message?: unknown, ...optionalParams: unknown[]) {
        mainWindow.webContents.send("console.error", { message, optionalParams })
    }

    /** 清除 renderer console (It only works in development mode.) */
    public static clear() {
        mainWindow.webContents.send("console.clear")
    }
}
