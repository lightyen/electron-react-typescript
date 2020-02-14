import Electron from "electron"
import { sendChannel } from "~/ipc"
import { Console } from "~/app"

/**
 * https://electronjs.org/docs/api/accelerator
 */
// NOTE: 可以使用 globalShortcut 模組來偵測鍵盤事件，就算你的應用程式視窗沒有 focus 也能作用。
function setGlobalShortcut() {
    Electron.globalShortcut.register("CmdOrCtrl+G", () => {
        if (process.platform === "darwin") {
            Console.log("Press Command+G")
        } else {
            Console.log("Press Control+G")
        }
    })
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
                    click: (item: Electron.MenuItem, win: Electron.BrowserWindow, e: Event) => {
                        win.webContents.toggleDevTools()
                    },
                },
                {
                    label: "Toggle Fullscreen",
                    accelerator: "F11",
                    click: (item, w, e) => {
                        const send = sendChannel(w, "window.fullscreen")
                        if (w.isFullScreen()) {
                            send(false)
                            w.setFullScreen(false)
                        } else {
                            send(true)
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
