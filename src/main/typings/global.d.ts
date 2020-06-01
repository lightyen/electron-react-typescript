export declare global {
	import { IpcMain } from "electron"
	namespace NodeJS {
		interface Global {
			/** custom global variable */
			abcde: number
			ipcMain: IpcMain
		}
		interface ProcessEnv {
			NODE_ENV: "development" | "production"
		}
	}
}
