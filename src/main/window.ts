import Electron from "electron"
import url from "url"
import path from "path"

import { send } from "~/ipc"
import { appPath, appName } from "~/const"
import { isDev } from "~/is"

import { newMenu } from "~/menu"
import { storage } from "~/store"
import { router } from "~/routes"

export class MainWindow extends Electron.BrowserWindow {
	constructor() {
		const backgroundColor = storage.get("backgroundColor") || "#1a202c"
		super({
			title: appName,
			show: false,
			minWidth: 820,
			minHeight: 600,
			frame: false,
			backgroundColor,
			webPreferences: {
				webSecurity: true,
				nodeIntegration: false,
				preload: isDev ? path.resolve(__dirname, "preload.js") : path.resolve(appPath, "preload.js"),
			},
			icon: path.join(appPath, "assets", "appicons", "256x256.png"),
		})
		this.setMenuBarVisibility(false)
		newMenu()
		router()

		this.on("maximize", () => send("window.maximized", true, this.webContents))
		this.on("unmaximize", () => send("window.maximized", false, this.webContents))
		this.on("show", () => {
			if (!this.isMaximized()) {
				const width = 1080
				const height = 680
				const display = Electron.screen.getPrimaryDisplay()
				this.setBounds(
					{ width, height, x: (display.bounds.width - width) / 2, y: (display.bounds.height - height) / 2 },
					false,
				)
			}
		})

		const loadURL = isDev
			? this.loadURL(
					url.format({
						protocol: "http",
						hostname: "localhost",
						pathname: "/",
						port: 3000,
						slashes: true,
					}),
			  )
			: this.loadURL(
					url.format({
						protocol: "file",
						hostname: "/",
						pathname: path.resolve(appPath, "index.html"),
						slashes: true,
					}),
			  )
		loadURL.then(() => {
			this.show()
		})
	}
}
