import Electron from "electron"
import url from "url"
import path from "path"

import { send } from "~/ipc"
import { appPath, appName } from "~/const"
import { isDev } from "~/is"

import { newMenu } from "~/menu"
import { storage } from "~/store"
import { router } from "~/routes"

export class MainWindow extends Electron.BrowserWindow {
    constructor() {
        const backgroundColor = storage.get("backgroundColor") || "#1a202c"
        super({
            title: appName,
            show: false,
            frame: false,
            resizable: true,
            width: 1280,
            height: 720,
            minWidth: 820,
            minHeight: 600,
            maximizable: true,
            backgroundColor,
            webPreferences: {
                webSecurity: true,
                nodeIntegration: false,
                preload: isDev ? path.resolve(__dirname, "preload.js") : path.resolve(appPath, "preload.js"),
            },
            icon: path.join(appPath, "assets", "appicons", "256x256.png"),
        })
        this.setMenuBarVisibility(false)

        newMenu()
        router()

        this.on("maximize", (e: Electron.Event) => send("window.maximized", true, this.webContents))
        this.on("unmaximize", (e: Electron.Event) => send("window.maximized", false, this.webContents))
        this.maximize()

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
                      pathname: path.resolve(appPath, "index.html"),
                      slashes: true,
                  }),
              )

        loadURL.then(() => this.show())
    }
}
