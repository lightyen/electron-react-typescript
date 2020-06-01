export declare global {
	import type { IpcRenderer, IpcMain, Shell } from "electron"
	import type ElectronLog from "electron-log"

	interface _Renderer {
		ipcRenderer: IpcRenderer
		shell: Shell
	}

	interface _Main {
		ipcMain: IpcMain
		log: ElectronLog
	}

	interface Window {
		electron: _Renderer
	}

	namespace NodeJS {
		interface Global {
			window: _Renderer
			electron: _Main
		}
	}
}
