import Electron from "electron"
import fs from "fs"
import { promisify } from "util"
import { response, on } from "~/ipc"

import { getAppName } from "~/routes/get.appname"
import { openDirectoryDialog } from "~/routes/open.dialog"
import { getPaths } from "~/routes/get.paths"
import { getLog } from "~/routes/get.syslog"
import { getVersions } from "~/routes/get.version"
import { getCPUUsage } from "~/routes/get.cpu"
import { getMemory } from "~/routes/get.memory"
import { setBackgroundColor, setAutoUpdate } from "./routes/set.default"
export function newRouter() {
    response("get.name", getAppName)
    response("get.versions", getVersions)
    response("get.cpuusage", getCPUUsage)
    response("get.memory", getMemory)
    response("dialog.open", openDirectoryDialog)
    response("get.paths", getPaths)
    response("get.log", getLog)
    on("set.default.backgroundColor", setBackgroundColor)
    on("set.default.autoUpdate", setAutoUpdate)
    on("show.folder", async (e, fullpath: string) => {
        const stat = await promisify(fs.stat)(fullpath)
        stat.isDirectory() && Electron.shell.openItem(fullpath)
    })
}
