import Electron from "electron"
import { isDev } from "./is"
import { windowFullscreen } from "shared/ipc"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focus 也能作用。
function setGlobalShortcut() {
	if (isDev) {
		Electron.globalShortcut.register("CmdOrCtrl+G", () => {
			if (process.platform === "darwin") {
				console.log("Press Command+G")
			} else {
				console.log("Press Control+G")
			}
		})
	}
	Electron.app.on("will-quit", () => {
		// 取消訂閱所有快速鍵
		Electron.globalShortcut.unregisterAll()
	})
}

export function newMenu() {
	setGlobalShortcut()
	const menuTemplate: Electron.MenuItemConstructorOptions[] = [
		{
			label: "Help",
			submenu: [
				{
					label: "Toggle Developer Tools",
					accelerator: "F12",
					click: (item: Electron.MenuItem, win: Electron.BrowserWindow) => {
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

	const mainMenu: Electron.Menu = Electron.Menu.buildFromTemplate(menuTemplate)
	Electron.Menu.setApplicationMenu(mainMenu)
}
