import Electron from "electron"
import { promises as fs } from "fs"
import { response, on } from "~/ipc"

import { getAppName } from "./get.appname"
import { openDirectoryDialog } from "./open.dialog"
import { getPaths } from "./get.paths"
import { getLog } from "./get.syslog"
import { getVersions } from "./get.version"
import { getCPUUsage } from "./get.cpu"
import { getMemory } from "./get.memory"
import { setBackgroundColor, setAutoUpdate } from "./set.default"
import { window_close, window_maximize, window_minimize, window_restore, window_isMaximized } from "./window"

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
		const stat = await fs.stat(fullpath)
		stat.isDirectory() && Electron.shell.openItem(fullpath)
	})
	on("window.close", window_close)
	on("window.maximize", window_maximize)
	on("window.minimize", window_minimize)
	on("window.restore", window_restore)
	response("window.maximized", window_isMaximized)
}
