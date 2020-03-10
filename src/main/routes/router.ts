import Electron from "electron"
import fs from "fs"
import { promisify } from "util"
import { response, on } from "~/ipc"

import { getAppName } from "./get.appname"
import { openDirectoryDialog } from "./open.dialog"
import { getPaths } from "./get.paths"
import { getLog } from "./get.syslog"
import { getVersions } from "./get.version"
import { getCPUUsage } from "./get.cpu"
import { getMemory } from "./get.memory"
import { setBackgroundColor, setAutoUpdate } from "./set.default"

export function router() {
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
