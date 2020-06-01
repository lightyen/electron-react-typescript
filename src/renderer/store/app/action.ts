import { createAction } from "@reduxjs/toolkit"
import { AppPaths, CPUInfo, SystemMemoryInfo, UpdateInfo } from "./model"
import { Versions } from "@/model"
import { request } from "~/ipc"

export const titlebarHideS = createAction<{ hide: boolean }>("GET_TITLEBAR_HIDE_SUCCESS")
export const getAppVersion = createAction("GET_APP_VERSION_REQUEST")
export const getAppVersionS = createAction<{ versions: Versions }>("GET_APP_VERSION_SUCCESS")
export const getAppPaths = createAction("GET_APP_PATHS_REQUEST")
export const getAppPathsS = createAction<{ paths: AppPaths }>("GET_APP_PATHS_SUCCESS")
export const getCpuUsage = createAction("GET_APP_CPU_USAGE_REQUEST")
export const getCpuUsageS = createAction<{ usage: CPUInfo }>("GET_APP_CPU_USAGE_SUCCESS")
export const getSystemMemoryInfo = createAction("GET_APP_SYSTEM_MEMORY_REQUEST")
export const getSystemMemoryInfoS = createAction<{ usage: SystemMemoryInfo }>("GET_APP_SYSTEM_MEMORY_SUCCESS")
export const updateApp = createAction("AUTO_UPDATE_RESTART")
export const updateAppS = createAction<{ info: UpdateInfo }>("AUTO_UPDATE_DOWNLOADED")

export const window_close = createAction("window.close", () => {
	request("window.close")
	return { payload: {} }
})
export const window_maximize = createAction("window.maximize", () => {
	request("window.maximize")
	return { payload: {} }
})
export const window_minimize = createAction("window.minimize", () => {
	request("window.minimize")
	return { payload: {} }
})
export const window_restore = createAction("window.restore", () => {
	request("window.restore")
	return { payload: {} }
})

export const windowMaximized = createAction<{ maximized: boolean }>("window.maximized")

export default {
	getAppVersion,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
	updateApp,
	window_close,
	window_maximize,
	window_minimize,
	window_restore,
}
