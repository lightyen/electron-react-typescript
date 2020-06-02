const { contextBridge, ipcRenderer, shell } = require("electron")

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke: (...args) => ipcRenderer.invoke.apply(ipcRenderer, args),
		on: (...args) => ipcRenderer.on.apply(ipcRenderer, args),
		addListener: (...args) => ipcRenderer.addListener.apply(ipcRenderer, args),
		send: (...args) => ipcRenderer.send.apply(ipcRenderer, args),
		removeListener: (...args) => ipcRenderer.removeListener.apply(ipcRenderer, args),
	},
	shell: {
		openExternal: (...args) => shell.openExternal.apply(shell, args),
	},
	log: require("electron-log"),
})
