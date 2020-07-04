import { app, globalShortcut } from "electron"
import { isDev } from "./is"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focused 也能作用。
export function setGlobalShortcut() {
	if (isDev) {
		// globalShortcut.register("f1", () => {
		// 	dialog.showMessageBox(null, {
		// 		type: "info",
		// 		title: app.getName(),
		// 		message: app.getName(),
		// 		detail: `Version: ${version}\nElectron: ${process.versions.electron}\nChrome: ${
		// 			process.versions.chrome
		// 		}\nNode.js: ${process.versions.node}\nV8: ${process.versions.v8}\nOS: ${process.env.OS} ${
		// 			process.arch
		// 		} ${os.release()}`,
		// 	})
		// })
	}
	app.on("will-quit", () => {
		// 取消訂閱所有快速鍵
		globalShortcut.unregisterAll()
	})
}
