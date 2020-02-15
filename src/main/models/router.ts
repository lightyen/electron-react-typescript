import Electron from "electron"
import fs from "fs"
import { promisify } from "util"
import { response, on } from "~/ipc"
import { getAppName, getVersions, getCPUUsage, getSystemInfo, openDirectoryDialog, getPaths, getLog } from "./handler"

export function newRouter() {
    response("app.get-name", getAppName)
    response("app.get-versions", getVersions)
    response("app.get-cpuusage", getCPUUsage)
    response("app.get-sysmem-info", getSystemInfo)
    response("app.dialog.open", openDirectoryDialog)
    response("app.get-paths", getPaths)
    response("get-log", getLog)
    on("open-folder", async (e, fullpath: string) => {
        const stat = await promisify(fs.stat)(fullpath)
        stat.isDirectory() && Electron.shell.openItem(fullpath)
    })
}
