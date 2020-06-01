import { IpcRenderer, IpcMain } from "electron"

export class Channel {
	static ipcRenderer: IpcRenderer = global?.window?.electron?.ipcRenderer
	static ipcMain: IpcMain = global?.electron?.ipcMain
	constructor(name: string) {
		if (name == undefined || name == "") throw new Error("invalid channel name!")
	}

	on() {
		if (Channel.ipcRenderer) {
			console.log(Channel.ipcRenderer)
		} else if (Channel.ipcMain) {
			console.log(typeof Channel.ipcMain.handle)
			global.electron.log.info("hey!")
		}
	}
}
