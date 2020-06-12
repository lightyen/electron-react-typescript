import { shell } from "electron"
import { openFolder } from "shared/ipc"
import { promises as fs } from "fs"

openFolder.on(async (_, fullpath) => {
	const stat = await fs.stat(fullpath)
	stat.isDirectory() && shell.openPath(fullpath)
})
