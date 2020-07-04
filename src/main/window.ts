import { BrowserWindow, screen, app } from "electron"
import url from "url"
import path from "path"

import { appPath } from "~/const"
import { isDev } from "~/is"

import { windowIsMaximized, windowReady } from "shared/ipc"

export function createMainWindow() {
	const backgroundColor = global.storage.get("backgroundColor")
	const main = new BrowserWindow({
		title: app.getName(),
		show: false,
		minWidth: 820,
		minHeight: 600,
		frame: false,
		backgroundColor,
		webPreferences: {
			webSecurity: true,
			nodeIntegration: false,
			nodeIntegrationInWorker: false,
			enableRemoteModule: false,
			contextIsolation: true,
			sandbox: false,
			preload: isDev ? path.resolve(__dirname, "../shared/preload.js") : path.resolve(appPath, "preload.js"),
		},
		icon: path.join(appPath, "assets", "appicons", "256x256.png"),
	})

	main.on("maximize", () => windowIsMaximized.sendWithWebContents(main.webContents, true))
	main.on("unmaximize", () => windowIsMaximized.sendWithWebContents(main.webContents, false))
	main.on("show", () => {
		if (!main.isMaximized()) {
			const width = 1080
			const height = 680
			const display = screen.getPrimaryDisplay()
			main.setBounds(
				{ width, height, x: (display.bounds.width - width) / 2, y: (display.bounds.height - height) / 2 },
				false,
			)
		}
	})

	isDev
		? main.loadURL(
				url.format({
					protocol: "http",
					hostname: "localhost",
					pathname: "/",
					port: 3000,
					slashes: true,
				}),
		  )
		: main.loadURL(
				url.format({
					protocol: "file",
					hostname: "/",
					pathname: path.resolve(appPath, "index.html"),
					slashes: true,
				}),
		  )

	windowReady.once(() => {
		main.show()
	})
	return main
}
