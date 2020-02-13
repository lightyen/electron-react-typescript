import Electron from "electron"
import { MainWindow } from "./window"
import { autoUpdater } from "electron-updater"
import log from "electron-log"
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"
import { serializeError } from "serialize-error"

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

// NOTE: https://github.com/electron/electron/issues/19468
Electron.app.on("ready", () => {
    // if (isDevMode()) {
    //     installExtension(REACT_DEVELOPER_TOOLS)
    //         .then(name => console.log(`Added Extension: ${name}`))
    //         .catch(err => console.error("An error occurred: ", err))
    // }
    initWindow()
    autoUpdater.autoDownload = true
    autoUpdater.autoInstallOnAppQuit = false
    let downloaded = false
    autoUpdater.on("update-downloaded", info => {
        downloaded = true
        const { version, releaseDate, sha512, ...rest } = info
        mainWindow.webContents.send("update-downloaded", { data: { version, sha512, releaseDate } })
    })
    Electron.ipcMain.on("update-restart", () => {
        if (downloaded) {
            autoUpdater.quitAndInstall()
        }
    })
    // check updates and download
    autoUpdater.checkForUpdates().catch(err => {
        console.error(err)
    })
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

export class Console {
    /** 輸出偵錯訊息到 console */
    public static log(message?: unknown, ...optionalParams: unknown[]) {
        console.log(message, ...optionalParams)
        mainWindow.webContents.send("console.log", { message, optionalParams })
    }

    /** 輸出警告訊息到 console */
    public static warn(message?: unknown, ...optionalParams: unknown[]) {
        console.warn(message, ...optionalParams)
        mainWindow.webContents.send("console.warn", { message, optionalParams })
    }

    /** 輸出錯誤訊息到 console */
    public static error(message?: unknown, ...optionalParams: unknown[]) {
        console.error(message, ...optionalParams)
        mainWindow.webContents.send("console.error", { message, optionalParams })
    }

    /** 清除 console */
    public static clear() {
        mainWindow.webContents.send("console.clear")
    }
}
