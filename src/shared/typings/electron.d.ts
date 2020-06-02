/* eslint-disable no-var */
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
			electron: _Main
		}
	}

	namespace globalThis {
		declare var electron: _Renderer
		declare var ipcMain: IpcMain
		declare var log: LogFunctions
	}
}
