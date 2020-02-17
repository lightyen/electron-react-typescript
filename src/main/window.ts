import Electron from "electron"
import url from "url"
import path from "path"

import { sendChannel } from "~/ipc"
import { appPath, appName } from "~/const"
import { isDev } from "~/is"

import { newMenu } from "~/menu"
import { newRouter } from "~/router"

import { store } from "~/store"

export class MainWindow extends Electron.BrowserWindow {
    constructor() {
        const backgroundColor = store.get("backgroundColor") || "#1a202c"
        super({
            title: appName,
            show: false,
            frame: false,
            resizable: true,
            minWidth: 820,
            minHeight: 600,
            backgroundColor,
            webPreferences: {
                nodeIntegration: true,
            },
            icon: path.join(appPath, "assets", "appicons", "256x256.png"),
        })
        this.setMenuBarVisibility(false)

        newMenu()
        newRouter()

        const sendMaximized = sendChannel<boolean>(this, "window.maximized")

        this.on("maximize", (e: Electron.Event) => {
            sendMaximized(true)
        })

        this.on("unmaximize", (e: Electron.Event) => {
            sendMaximized(false)
        })

        const loadURL = isDev
            ? this.loadURL(
                  url.format({
                      protocol: "http",
                      hostname: "localhost",
                      pathname: "/",
                      port: 3000,
                      slashes: true,
                  }),
              )
            : this.loadURL(
                  url.format({
                      protocol: "file",
                      hostname: "/",
                      pathname: path.resolve(appPath, "dist", "index.html"),
                      slashes: true,
                  }),
              )

        this.show()
    }
}
