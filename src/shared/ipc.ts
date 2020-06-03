import createIPC from "./createIPC"
import type { Versions, AppPaths, CPUInfo, SystemMemoryInfo, AutoUpdateInfo } from "./model"
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron"

export const appVersions = createIPC<null, Versions>("get.versions")
export const appPaths = createIPC<null, AppPaths>("get.appPaths")
export const cpuInfo = createIPC<null, CPUInfo>("get.cpu")
export const memoryUsage = createIPC<null, SystemMemoryInfo>("get.memory.usage")
export const appLogs = createIPC<null, string>("get.app.logs")

// window
export const windowClose = createIPC("window.close")
export const windowMaximize = createIPC("window.maximize")
export const windowMinimize = createIPC("window.minimize")
export const windowRestore = createIPC("window.restore")
export const windowIsMaximized = createIPC<boolean, boolean>("window.ismaximized")
export const windowFullscreen = createIPC<boolean, boolean>("window.fullscreen")

// app auto-update
export const updateAndRestart = createIPC("auto-update.restart")
export const autoUpdateDownloaded = createIPC<AutoUpdateInfo, AutoUpdateInfo>("auto-update.downloaded")

export const openFolder = createIPC<string>("open.item.folder")
export const openFolderDialog = createIPC<OpenDialogOptions, Partial<OpenDialogReturnValue & { files: string[] }>>(
	"open.dialog.folder",
)

export const setDefaultBackgroundColor = createIPC<string>("set.default.backgroundColor")
export const setDefaultAutoUpdate = createIPC<boolean>("set.default.autoUpdate")
