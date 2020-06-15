import { app, globalShortcut } from "electron"
import { isDev } from "./is"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focused 也能作用。
export function setGlobalShortcut() {
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
