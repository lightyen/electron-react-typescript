const { remote, ipcRenderer, shell } = require("electron")

window.electron = {}
window.electron.currentWindow = remote.getCurrentWindow()
window.electron.ipcRenderer = ipcRenderer
window.electron.shell = shell
