import type { IpcMain, BrowserWindow } from "electron"
import type { IpcRenderer, Shell } from "electron"
import type { ElectronLog } from "electron-log"

declare global {
	interface Renderer {
		log: ElectronLog
		ipcRenderer: IpcRenderer
		shell: Shell
	}

	interface Main {
		log: ElectronLog
		ipcMain: IpcMain
		BrowserWindow: BrowserWindow
	}

	interface Window {
		electron: Renderer
	}

	namespace NodeJS {
		interface Global {
			electron: Main
		}
	}
}
