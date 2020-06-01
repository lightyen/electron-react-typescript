import type { IpcRenderer, IpcMain, Shell } from "electron"
import type { LogFunctions } from "electron-log"
declare global {
	interface _Renderer {
		ipcRenderer: IpcRenderer
		shell: Shell
	}

	interface _Main {
		ipcMain: IpcMain
		log: LogFunctions
	}

	interface Window {
		electron: _Renderer
	}

	namespace NodeJS {
		interface Global {
			window: Window
			electron: _Main
		}
	}
}
