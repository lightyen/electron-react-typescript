import { Version, AppPaths, CPUInfo, SystemMemoryInfo, UpdateInfo } from "./model"

export interface GetAppTitleBarHideAction {
	type: "GET_TITLEBAR_HIDE"
	hide: boolean
}

export interface GetAppVersionAction {
	type: "GET_APP_VERSION_REQUEST" | "GET_APP_VERSION_SUCCESS" | "GET_APP_VERSION_FAILURE"
	version?: Version
}

export interface GetAppPathsAction {
	type: "GET_APP_PATHS_REQUEST" | "GET_APP_PATHS_SUCCESS" | "GET_APP_PATHS_FAILURE"
	paths?: AppPaths
}

export interface GetAppCpuUsageAction {
	type: "GET_APP_CPU_USAGE_REQUEST" | "GET_APP_CPU_USAGE_SUCCESS" | "GET_APP_CPU_USAGE_FAILURE"
	usage?: CPUInfo
}

export interface GetAppSystemMemoryAction {
	type: "GET_APP_SYSTEM_MEMORY_REQUEST" | "GET_APP_SYSTEM_MEMORY_SUCCESS" | "GET_APP_SYSTEM_MEMORY_FAILURE"
	usage?: SystemMemoryInfo
}

export interface AutoUpdateDownloadedAction {
	type: "AUTO_UPDATE_DOWNLOADED"
	info: UpdateInfo
}

export const getVersion = (): GetAppVersionAction => {
	return { type: "GET_APP_VERSION_REQUEST" }
}

export const getAppPaths = (): GetAppPathsAction => {
	return { type: "GET_APP_PATHS_REQUEST" }
}

export const getCpuUsage = (): GetAppCpuUsageAction => {
	return { type: "GET_APP_CPU_USAGE_REQUEST" }
}

export const getSystemMemoryInfo = (): GetAppSystemMemoryAction => {
	return { type: "GET_APP_SYSTEM_MEMORY_REQUEST" }
}

export const updateApp = () => {
	return { type: "AUTO_UPDATE_RESTART" }
}

const actionCreators = {
	getVersion,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
	updateApp,
}

export default actionCreators

export type Action =
	| GetAppTitleBarHideAction
	| GetAppVersionAction
	| GetAppPathsAction
	| GetAppCpuUsageAction
	| GetAppSystemMemoryAction
	| AutoUpdateDownloadedAction
