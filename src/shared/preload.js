const { contextBridge, ipcRenderer, shell } = require("electron")

function ipcRendererExpose(...expose) {
	const ret = {}
	for (const name of expose) {
		ret[name] = (...args) => ipcRenderer[name].apply(ipcRenderer, args)
	}
	return ret
}

const log = require("electron-log")

contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: ipcRendererExpose("invoke", "on", "addListener", "send", "removeListener"),
	shell: {
		openExternal: (...args) => shell.openExternal.apply(shell, args),
	},
	log,
})

console.log = log.log
console.error = log.error
console.warn = log.warn
