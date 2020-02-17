import Electron from "electron"
import { IpcPromiseHandler } from "~/ipc"

import fs from "fs"
import { promisify } from "util"

const readdir = promisify(fs.readdir)

export const openDirectoryDialog: IpcPromiseHandler = async (
    e: Electron.IpcMainEvent,
    options: Electron.OpenDialogOptions,
) => {
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

    const list = await readdir(rest.filePaths[0])
    return {
        ...rest,
        files: list,
    }
}
