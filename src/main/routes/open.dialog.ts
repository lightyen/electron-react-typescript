import Electron from "electron"

import { promises as fs } from "fs"

export const openDirectoryDialog = async (e: Electron.IpcMainEvent, options: Electron.OpenDialogOptions) => {
	options = {
		title: "Select a folder",
		properties: ["openDirectory"],
	}
	options = options || {}
	const { canceled, ...rest } = await Electron.dialog.showOpenDialog(
		Electron.BrowserWindow.fromWebContents(e.sender),
		options,
	)
	if (canceled) {
		return null // no response
	}

	const list = await fs.readdir(rest.filePaths[0])
	return {
		...rest,
		files: list,
	}
}
