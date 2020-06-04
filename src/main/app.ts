import Electron from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"
import log from "electron-log"

import { createMainWindow } from "~/window"
import { createStorage } from "~/storage"
import { isDev } from "~/is"
import { install, REACT_DEVELOPER_TOOLS } from "~/electron-devtools-installer"
import { updateAndRestart, autoUpdateDownloaded } from "shared/ipc"
import semver from "semver"

if (semver.satisfies(process.versions.electron, "<9.0.0")) {
	Electron.app.allowRendererProcessReuse = true
}

export function initWindow() {
	global.storage = createStorage()
	global.mainWindow = createMainWindow()
	global.mainWindow.on("closed", () => {
		global.mainWindow = undefined
	})
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
		const { version, releaseDate, sha512 } = info
		autoUpdateDownloaded.sendWithWebContents(global.mainWindow.webContents, { version, sha512, releaseDate })
	})
	updateAndRestart.on(() => {
		if (downloaded) {
			autoUpdater.quitAndInstall()
		}
	})
	// check updates and download
	if (global.storage.get("autoUpdate")) {
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
	if (!global.mainWindow) {
		initWindow()
	}
})

Electron.app.on("window-all-closed", () => {
	Electron.app.quit()
})
