const { contextBridge, ipcRenderer, shell } = require("electron")

// https://stackoverflow.com/questions/57807459/how-to-use-preload-js-properly-in-electron

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		send: (channel, ...args) => ipcRenderer.send(channel, ...args),
		on: (channel, listener) => ipcRenderer.on(channel, listener),
		once: (channel, listener) => ipcRenderer.once(channel, listener),
		removeListener: (channel, listener) => ipcRenderer.removeListener(channel, listener),
	},
	shell: {
		openExternal: (...args) => shell.openExternal(...args),
	},
})
