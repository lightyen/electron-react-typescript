import { Menu } from "electron"
import type { MenuItem, MenuItemConstructorOptions, BrowserWindow } from "electron"
import { windowFullscreen } from "shared/ipc"

export function setMenu() {
	const menuTemplate: MenuItemConstructorOptions[] = [
		{
			label: "Help",
			submenu: [
				{
					label: "Open Developer Tools",
					accelerator: "F12",
					click: (item: MenuItem, win: BrowserWindow) => {
						win.webContents.openDevTools({ mode: "undocked" })
					},
				},
				{
					label: "Toggle Fullscreen",
					accelerator: "F11",
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
			],
		},
	]

	if (process.platform === "darwin") {
		menuTemplate.unshift({})
	}

	const mainMenu: Menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(mainMenu)
}
