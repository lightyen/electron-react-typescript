import { createAction } from "@reduxjs/toolkit"
import { AppPaths, CPUInfo, SystemMemoryInfo, AutoUpdateInfo } from "shared/model"
import { Versions } from "shared/model"
import { windowClose, windowMaximize, windowMinimize, windowRestore, updateAndRestart } from "shared/ipc"

export const titlebarHideS = createAction<{ hide: boolean }>("GET_TITLEBAR_HIDE_SUCCESS")
export const getAppVersion = createAction("GET_APP_VERSION_REQUEST")
export const getAppVersionS = createAction<{ versions: Versions }>("GET_APP_VERSION_SUCCESS")
export const getAppPaths = createAction("GET_APP_PATHS_REQUEST")
export const getAppPathsS = createAction<{ paths: AppPaths }>("GET_APP_PATHS_SUCCESS")
export const getCpuUsage = createAction("GET_APP_CPU_USAGE_REQUEST")
export const getCpuUsageS = createAction<{ usage: CPUInfo }>("GET_APP_CPU_USAGE_SUCCESS")
export const getSystemMemoryInfo = createAction("GET_APP_SYSTEM_MEMORY_REQUEST")
export const getSystemMemoryInfoS = createAction<{ usage: SystemMemoryInfo }>("GET_APP_SYSTEM_MEMORY_SUCCESS")

export const updateAppAndRestart = createAction("AUTO_UPDATE_RESTART", () => {
	updateAndRestart.send()
	return { payload: {} }
})

export const appNewVersion = createAction<{ info: AutoUpdateInfo }>("AUTO_UPDATE_DOWNLOADED")

export const window_close = createAction("window.close", () => {
	windowClose.send()
	return { payload: {} }
})
export const window_maximize = createAction("window.maximize", () => {
	windowMaximize.send()
	return { payload: {} }
})
export const window_minimize = createAction("window.minimize", () => {
	windowMinimize.send()
	return { payload: {} }
})
export const window_restore = createAction("window.restore", () => {
	windowRestore.send()
	return { payload: {} }
})

export const windowMaximized = createAction<{ maximized: boolean }>("window.maximized")

export default {
	getAppVersion,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
	updateAppAndRestart,
	window_close,
	window_maximize,
	window_minimize,
	window_restore,
}
