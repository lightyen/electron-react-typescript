/* eslint-disable no-var */
import type { IpcRenderer, IpcMain, Shell, BrowserWindow } from "electron"
import type { LogFunctions } from "electron-log"
declare global {
	interface _Renderer {
		ipcRenderer: IpcRenderer
		shell: Shell
	}

	interface _Main {
		ipcMain: IpcMain
		BrowserWindow: BrowserWindow
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
		declare var electron: _Renderer & _Main
		declare var log: LogFunctions
	}
}
