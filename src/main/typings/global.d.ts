import type { BrowserWindow } from "electron"
import type { AppStorage } from "~/storage"

declare global {
	namespace NodeJS {
		interface Global {
			storage: AppStorage
			mainWindow: BrowserWindow
		}
	}
}
