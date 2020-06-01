const { contextBridge, ipcRenderer, shell } = require("electron")

// https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		invoke: (...args) => ipcRenderer.invoke(...args),
		on: (...args) => ipcRenderer.on(...args),
		once: (...args) => ipcRenderer.once(...args),
		send: (...args) => ipcRenderer.send(...args),
		sendTo: (...args) => ipcRenderer.sendTo(...args),
		sendSync: (...args) => ipcRenderer.sendSync(...args),
		sendToHost: (...args) => ipcRenderer.sendToHost(...args),
		removeListener: (...args) => ipcRenderer.removeListener(...args),
		removeAllListeners: (...args) => ipcRenderer.removeAllListeners(...args),
	},
	shell: {
		openExternal: (...args) => shell.openExternal(...args),
	},
})
