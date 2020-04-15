import Electron from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"
import log from "electron-log"

import { MainWindow } from "~/window"
import { storage } from "~/store"
import { isDev } from "~/is"
import { install, REACT_DEVELOPER_TOOLS } from "~/electron-devtools-installer"

export let mainWindow: Electron.BrowserWindow

Electron.app.allowRendererProcessReuse = true

export function initWindow() {
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
    if (isDev) {
        install(REACT_DEVELOPER_TOOLS).catch(err => console.error(err))
    }
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
    if (storage.get("autoUpdate")) {
        autoUpdater.checkForUpdates().catch(err => {
            switch (err.code) {
                default:
                    log.error(err)
                    break
            }
        })
    }
})

Electron.app.on("activate", () => {
    if (!mainWindow) {
        initWindow()
    }
})

Electron.app.on("window-all-closed", () => {
    Electron.app.quit()
})
