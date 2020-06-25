import createIPC from "./createIPC"
import type { Versions, AppPaths, CPUInfo, SystemMemoryInfo, AutoUpdateInfo } from "./model"
import type { OpenDialogOptions, OpenDialogReturnValue } from "electron"

// export const custom = createIPC<MainReturn, RendererPayload, MainPayload, RendererReturn>("custom")

export const appVersions = createIPC<Versions>("get.versions")
export const appPaths = createIPC<AppPaths>("get.appPaths")
export const cpuInfo = createIPC<CPUInfo>("get.cpu")
export const memoryUsage = createIPC<SystemMemoryInfo>("get.memory.usage")
export const appLogs = createIPC<string>("get.app.logs")

// window
export const windowClose = createIPC("window.close")
export const windowMaximize = createIPC("window.maximize")
export const windowMinimize = createIPC("window.minimize")
export const windowRestore = createIPC("window.restore")
export const windowIsMaximized = createIPC<boolean>("window.ismaximized")
export const windowFullscreen = createIPC<boolean>("window.fullscreen")

// app auto-update
export const updateAndRestart = createIPC("auto-update.restart")
export const autoUpdateDownloaded = createIPC<AutoUpdateInfo>("auto-update.downloaded")

export const openFolder = createIPC<void, string>("open.item.folder")
export const openFolderDialog = createIPC<Partial<OpenDialogReturnValue & { files: string[] }>, OpenDialogOptions>(
	"open.dialog.folder",
)

export const setDefaultBackgroundColor = createIPC<void, string>("set.default.backgroundColor")
export const setDefaultAutoUpdate = createIPC<void, boolean>("set.default.autoUpdate")
