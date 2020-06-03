import { BrowserWindow, dialog } from "electron"
import { promises as fs } from "fs"
import { openFolderDialog } from "shared/ipc"

openFolderDialog.handle(async (e, options = {}) => {
	const { canceled, ...rest } = await dialog.showOpenDialog(BrowserWindow.fromWebContents(e.sender), options)
	if (canceled) {
		return { canceled }
	}

	const list = await fs.readdir(rest.filePaths[0])
	return {
		canceled,
		...rest,
		files: list,
	}
})
