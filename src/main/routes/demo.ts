import { dialog } from "electron"
import { dndimages } from "@shared/ipc"
import path from "path"
// import { appPath } from "~/const"

async function findImages(filePaths: string[]) {
	const result: string[] = []
	try {
		for (const p of filePaths) {
			const ext = path.extname(p)
			if (ext == ".jpg" || ext == ".jpeg" || ext == ".png" || ext == ".gif" || ext == ".ico") {
				result.push(p)
			}
		}
	} catch (err) {
		const log = global.electron.log
		log.error(err)
	}
	return result
}

dndimages.on(async (e, files) => {
	if (!files || files.length == 0) {
		const { canceled, filePaths } = await dialog.showOpenDialog(global.mainWindow, {
			properties: ["openFile", "multiSelections", "dontAddToRecent"],
		})
		if (canceled) {
			return
		}
		console.log(await findImages(filePaths))
	} else {
		console.log(await findImages(files))
	}
})
