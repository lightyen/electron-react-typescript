import Electron from "electron"
import fs from "fs"
import { promisify } from "util"
import { response, on } from "~/ipc"
import { getAppName, getVersions, getCPUUsage, getSystemInfo, openDirectoryDialog, getPaths, getLog } from "./handler"

export function newRouter() {
    response("get.name", getAppName)
    response("get.versions", getVersions)
    response("get.cpuusage", getCPUUsage)
    response("get.sysmeminfo", getSystemInfo)
    response("dialog.open", openDirectoryDialog)
    response("get.paths", getPaths)
    response("get.log", getLog)
    on("show.folder", async (e, fullpath: string) => {
        const stat = await promisify(fs.stat)(fullpath)
        stat.isDirectory() && Electron.shell.openItem(fullpath)
    })
}
