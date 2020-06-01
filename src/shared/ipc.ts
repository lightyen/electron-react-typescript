import { isRenderer, isMain } from "./is"
import { getIpcRenderer, getIpcMain } from "./interface"
import { IpcRenderer, IpcMain } from "electron"

export class Channel {
	static ipcRender: IpcRenderer = getIpcRenderer()
	static ipcMain: IpcMain = getIpcMain()
	constructor(name: string) {
		if (name == undefined || name == "") throw new Error("invalid channel name!")
	}

	on() {
		// console.log(typeof ipcMain)
		if (isRenderer()) {
			console.log(Channel.ipcRender)
		}

		if (isMain()) {
			console.log(Channel.ipcMain)
		}
	}
}
