const { contextBridge, ipcRenderer, shell } = require("electron")
const log = require("electron-log")

function ipcRendererExpose(...expose) {
	const ret = {}
	for (const name of expose) {
		ret[name] = (...args) => ipcRenderer[name].apply(ipcRenderer, args)
	}
	return ret
}

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
