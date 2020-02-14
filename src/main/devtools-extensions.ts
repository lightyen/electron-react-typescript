import Electron from "electron"
import path from "path"
import { isDevMode } from "~/is"

// NOTE: https://github.com/electron/electron/issues/19468
// NOTE: https://github.com/MarshallOfSound/electron-devtools-installer/pull/92
// import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"

// Load local devtools
Electron.app.on("ready", () => {
    if (isDevMode()) {
        if (process.platform === "linux") {
            const result = Electron.BrowserWindow.getDevToolsExtensions()
            if (!Object.keys(result).includes("React Developer Tools")) {
                Electron.BrowserWindow.addDevToolsExtension(
                    path.join(process.cwd(), "devtools-extensions/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0"),
                )
            }
            if (!Object.keys(result).includes("Redux DevTools")) {
                Electron.BrowserWindow.addDevToolsExtension(
                    path.join(process.cwd(), "devtools-extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0"),
                )
            }
        }
    }
})
