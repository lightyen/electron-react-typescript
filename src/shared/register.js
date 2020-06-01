global.electron = {
	ipcMain: require("electron").ipcMain,
	log: {
		...require("electron-log"),
	},
}
