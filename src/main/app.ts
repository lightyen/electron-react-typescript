import { app, dialog } from "electron"
import { autoUpdater } from "electron-updater"
import path from "path"

import { setGlobalShortcut } from "~/globalShortcut"
import { setMenu } from "~/menu"
import "~/router"

import { createMainWindow } from "~/window"
import { createStorage } from "~/storage"
import { updateAndRestart, autoUpdateDownloaded } from "@shared/ipc"
import semver from "semver"
import { isDev } from "~/is"
import log from "electron-log"
// import { install, REACT_DEVELOPER_TOOLS } from "~/electron-devtools-installer"

// import LevelRocksDB from "level-rocksdb"
process.on("uncaughtException", err => {
	log.error(err)
	dialog.showErrorBox(err.name, err.stack)
	app.quit()
})

if (semver.satisfies(process.versions.electron, "<9.0.0")) {
	app.allowRendererProcessReuse = true
}

if (isDev) {
	process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true
}

export function initWindow() {
	global.storage = createStorage()
	global.mainWindow = createMainWindow()
	// if (isDev) {
	// 	install( global.mainWindow, REACT_DEVELOPER_TOOLS).catch(err => log.error(err))
	// }
	global.mainWindow.on("closed", () => {
		global.mainWindow = undefined
	})
}

app.on("will-finish-launching", () => app.setAppLogsPath(path.join(app.getPath("userData"), "logs")))

app.on("ready", async () => {
	// new LevelRocksDB(path.resolve(app.getPath("userData"), "rocksdb"))
	setGlobalShortcut()
	setMenu()
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

app.on("activate", () => {
	if (!global.mainWindow) {
		initWindow()
	}
})

app.on("window-all-closed", () => {
	app.quit()
})
