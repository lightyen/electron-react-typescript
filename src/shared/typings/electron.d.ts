/* eslint-disable no-var */
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

	namespace globalThis {
		declare var electron: Renderer & Main
		declare var log: LogFunctions
	}
}
