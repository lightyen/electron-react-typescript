import type { IpcRenderer, IpcMain, Shell, BrowserWindow } from "electron"
import type { ElectronLog } from "electron-log"
declare global {
	interface Renderer {
		ipcRenderer: IpcRenderer
		shell: Shell
	}

	interface Main {
		ipcMain: IpcMain
		BrowserWindow: BrowserWindow
		log: ElectronLog
	}

	interface Window {
		electron: Renderer
	}

	namespace NodeJS {
		interface Global {
			electron: Main
		}
	}

	declare namespace globalThis {
		// eslint-disable-next-line no-var
		export var electron: Renderer & Main
		// eslint-disable-next-line no-var
		export var log: LogFunctions
	}
}
