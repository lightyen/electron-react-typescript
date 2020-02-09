import Electron from "electron"
import ipc from "~/ipc"
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
                        // if (w.isFullScreen()) {
                        //     ipc.send(w.webContents)("window.fullscreen", { data: false })
                        //     w.setFullScreen(false)
                        // } else {
                        //     ipc.send(w.webContents)("window.fullscreen", { data: true })
                        //     w.setFullScreen(true)
                        // }

                        const send = ipc.sender<boolean>(w)
                        if (w.isFullScreen()) {
                            send("window.fullscreen", { data: false })
                            w.setFullScreen(false)
                        } else {
                            send("window.fullscreen", { data: true })
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
