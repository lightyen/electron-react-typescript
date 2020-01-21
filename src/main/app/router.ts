import ipc from "~/ipc"
import { getAppName, getVersions, getCPUUsage, getSystemInfo, openDirectoryDialog } from "./handler"

export default function setRouter() {
    ipc.on("app.get-name", getAppName)
    ipc.on("app.get-versions", getVersions)
    ipc.on("app.get-cpuusage", getCPUUsage)
    ipc.on("app.get-sysmem-info", getSystemInfo)
    ipc.on("app.dialog.open", openDirectoryDialog)
}
