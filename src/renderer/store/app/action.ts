import { createAction } from "@reduxjs/toolkit"
import { Version, AppPaths, CPUInfo, SystemMemoryInfo, UpdateInfo } from "./model"

export const titlebarHideS = createAction<{ hide: boolean }>("GET_TITLEBAR_HIDE_SUCCESS")
export const getAppVersion = createAction("GET_APP_VERSION_REQUEST")
export const getAppVersionS = createAction<{ version: Version }>("GET_APP_VERSION_SUCCESS")
export const getAppPaths = createAction("GET_APP_PATHS_REQUEST")
export const getAppPathsS = createAction<{ paths: AppPaths }>("GET_APP_PATHS_SUCCESS")
export const getCpuUsage = createAction("GET_APP_CPU_USAGE_REQUEST")
export const getCpuUsageS = createAction<{ usage: CPUInfo }>("GET_APP_CPU_USAGE_SUCCESS")
export const getSystemMemoryInfo = createAction("GET_APP_SYSTEM_MEMORY_REQUEST")
export const getSystemMemoryInfoS = createAction<{ usage: SystemMemoryInfo }>("GET_APP_SYSTEM_MEMORY_SUCCESS")
export const updateApp = createAction("AUTO_UPDATE_RESTART")
export const updateAppS = createAction<{ info: UpdateInfo }>("AUTO_UPDATE_DOWNLOADED")

export default {
	getAppVersion,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
	updateApp,
}
