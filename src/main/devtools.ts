import Electron from "electron"
import path from "path"
import { isDev } from "~/is"

// NOTE: https://github.com/electron/electron/issues/19468
// NOTE: https://github.com/MarshallOfSound/electron-devtools-installer/pull/92
// import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"

// Load local devtools
Electron.app.on("ready", () => {
    if (isDev) {
        const result = Electron.BrowserWindow.getDevToolsExtensions()
        const platform = process.platform
        if (!Object.keys(result).includes("React Developer Tools")) {
            Electron.BrowserWindow.addDevToolsExtension(
                path.join(process.cwd(), `debug/extensions/${platform}/fmkadmapgofadopljbjfkapdkoienihi/4.4.0_0`),
            )
        }
        if (!Object.keys(result).includes("Redux DevTools")) {
            Electron.BrowserWindow.addDevToolsExtension(
                path.join(process.cwd(), `debug/extensions/${platform}/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0`),
            )
        }
    }
})
