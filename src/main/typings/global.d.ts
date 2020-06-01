import { IpcMain } from "electron"

declare global {
	namespace NodeJS {
		interface Electron {
			ipcMain: IpcMain
		}
		interface Global {
			electron: Electron
		}
		interface ProcessEnv {
			NODE_ENV: "development" | "production"
		}
	}
}
