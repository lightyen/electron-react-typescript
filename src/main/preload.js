const { remote, ipcRenderer, shell } = require("electron")

window.electron = {
    currentWindow: remote.getCurrentWindow(),
    ipcRenderer,
    shell,
}
