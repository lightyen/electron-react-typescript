import Electron from "electron"
import ipc from "~/ipc"
import { RendererConsole } from "~/app"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focus 也能作用。
function setGlobalShortcut() {
    Electron.globalShortcut.register("CmdOrCtrl+Shift+C", () => {
        if (process.platform === "darwin") {
            RendererConsole.log("Press Command+Shift+C")
        } else {
            RendererConsole.log("Press Control+Shift+C")
        }
    })
    Electron.app.on("will-quit", () => {
        // 取消訂閱所有快速鍵
        Electron.globalShortcut.unregisterAll()
    })
}

export default function setMenu() {
    setGlobalShortcut()
    const menuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: "Help",
            submenu: [
                {
                    label: "Toggle Developer Tools",
                    accelerator: "F12",
                    click: (item: Electron.MenuItem, win: Electron.BrowserWindow, e: Event) => {
                        win.webContents.toggleDevTools()
                    },
                },
                {
                    label: "Toggle Fullscreen",
                    accelerator: "F11",
                    click: (item, w, e) => {
                        console.log(e)
                        if (w.isFullScreen()) {
                            ipc.send(w.webContents)("window.fullscreen", { data: false })
                            w.setFullScreen(false)
                        } else {
                            ipc.send(w.webContents)("window.fullscreen", { data: true })
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
