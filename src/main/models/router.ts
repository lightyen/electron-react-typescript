import { on } from "~/ipc"
import { getAppName, getVersions, getCPUUsage, getSystemInfo, openDirectoryDialog, getPaths, getLog } from "./handler"

export function newRouter() {
    on("app.get-name", getAppName)
    on("app.get-versions", getVersions)
    on("app.get-cpuusage", getCPUUsage)
    on("app.get-sysmem-info", getSystemInfo)
    on("app.dialog.open", openDirectoryDialog)
    on("app.get-paths", getPaths)
    on("get-log", getLog)
}
