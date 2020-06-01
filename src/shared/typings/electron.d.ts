export declare global {
	import { IpcRenderer, BrowserWindow, Shell } from "electron"
	interface Window {
		electron: PreloadElectron
	}
	interface PreloadElectron {
		ipcRenderer: IpcRenderer
		shell: Shell
	}
}
