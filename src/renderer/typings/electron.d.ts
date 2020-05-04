export declare global {
	import { IpcRenderer, BrowserWindow, Shell } from "electron"
	interface Window {
		electron: PreloadElectron
	}
	interface PreloadElectron {
		currentWindow: BrowserWindow
		ipcRenderer: IpcRenderer
		shell: Shell
	}
}
