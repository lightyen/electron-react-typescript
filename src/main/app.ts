import Electron from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"
import log from "electron-log"

import { MainWindow } from "~/window"
import { isDev } from "~/is"
import { install, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "~/electron-devtools-installer"

export let mainWindow: Electron.BrowserWindow

export function initWindow() {
    if (isDev) {
        install(REACT_DEVELOPER_TOOLS).catch(err => console.error(err))
        install(REDUX_DEVTOOLS).catch(err => console.error(err))
    }
    mainWindow = new MainWindow()
    mainWindow.on("closed", () => {
        mainWindow = null
    })
    return mainWindow
}

Electron.app.on("will-finish-launching", () =>
    Electron.app.setAppLogsPath(path.join(Electron.app.getPath("userData"), "logs")),
)

Electron.app.on("ready", () => {
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
        switch (err.code) {
            case "ENOENT":
                break
            case "ERR_XML_MISSED_ELEMENT":
                break
            default:
                log.error(err)
                break
        }
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
