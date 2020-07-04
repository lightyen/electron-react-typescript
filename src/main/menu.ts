import { Menu, app, dialog } from "electron"
import type { MenuItem, MenuItemConstructorOptions, BrowserWindow } from "electron"
import { windowFullscreen } from "shared/ipc"
import os from "os"
import { version } from "~/const"

export function setMenu() {
	const menuTemplate: MenuItemConstructorOptions[] = [
		{
			label: "Help",
			submenu: [
				{
					label: "Version",
					accelerator: "F1",
					click: (item: MenuItem, win: BrowserWindow) => {
						dialog.showMessageBox(null, {
							type: "info",
							title: app.getName(),
							message: app.getName(),
							detail: `Version: ${version}\nElectron: ${process.versions.electron}\nChrome: ${
								process.versions.chrome
							}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}\nOS: ${process.env.OS} ${
								process.arch
							} ${os.release()}`,
						})
					},
				},
				{
					label: "Toggle Fullscreen",
					accelerator: "f11",
					click: (item, w) => {
						if (w.isFullScreen()) {
							windowFullscreen.sendWithWebContents(w.webContents, false)
							w.setFullScreen(false)
						} else {
							windowFullscreen.sendWithWebContents(w.webContents, true)
							w.setFullScreen(true)
						}
					},
				},
				{
					label: "Open Developer Tools",
					accelerator: "f12",
					click: (item: MenuItem, win: BrowserWindow) => {
						win.webContents.isDevToolsOpened()
							? win.webContents.closeDevTools()
							: win.webContents.openDevTools({ mode: "right" })
					},
				},
				{
					label: "Open Developer Tools (Undocked)",
					accelerator: "shift+f12",
					click: (item: MenuItem, win: BrowserWindow) => {
						win.webContents.isDevToolsOpened()
							? win.webContents.closeDevTools()
							: win.webContents.openDevTools({ mode: "undocked" })
					},
				},
			],
		},
	]

	if (process.platform === "darwin") {
		menuTemplate.unshift({})
	}

	const mainMenu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(mainMenu)
}
