import Electron from "electron"
import url from "url"
import path from "path"
import fs from "fs"

import ipc from "~/ipc"
import { isDevMode, appPath, appName } from "~/app"
import setMenu from "~/app/menu"
import setRouter from "~/app/router"

export class MainWindow extends Electron.BrowserWindow {
    constructor() {
        super({
            title: appName,
            show: true,
            frame: false,
            resizable: true,
            minWidth: 460,
            minHeight: 300,
            webPreferences: {
                nodeIntegration: true,
            },
            icon: path.join(appPath, "assets", "appicons", "256x256.png"),
        })
        this.hide()
        this.setMenuBarVisibility(false)

        setMenu()
        setRouter()

        this.on("maximize", (e: Electron.Event) => {
            ipc.send(this.webContents)("window.maximized", { data: true })
        })

        this.on("unmaximize", (e: Electron.Event) => {
            ipc.send(this.webContents)("window.maximized", { data: false })
        })

        this.webContents.send("window.maximized", this.isMaximized())

        const loadURL = isDevMode()
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

        loadURL.then(() => {
            this.show()
        })
    }
}
