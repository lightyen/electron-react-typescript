import { app, globalShortcut, Menu } from "electron"
import type { MenuItem, MenuItemConstructorOptions, BrowserWindow } from "electron"
import { isDev } from "./is"
import { windowFullscreen } from "shared/ipc"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focus 也能作用。
function setGlobalShortcut() {
	if (isDev) {
		globalShortcut.register("CmdOrCtrl+G", () => {
			if (process.platform === "darwin") {
				console.log("Press Command+G")
			} else {
				console.log("Press Control+G")
			}
		})
	}
	app.on("will-quit", () => {
		// 取消訂閱所有快速鍵
		globalShortcut.unregisterAll()
	})
}

export function newMenu() {
	setGlobalShortcut()
	const menuTemplate: MenuItemConstructorOptions[] = [
		{
			label: "Help",
			submenu: [
				{
					label: "Toggle Developer Tools",
					accelerator: "F12",
					click: (item: MenuItem, win: BrowserWindow) => {
						win.webContents.toggleDevTools()
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
