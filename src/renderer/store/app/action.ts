import { Version, AppPaths, CPUInfo, SystemMemoryInfo, UpdateInfo } from "./model"

export const GET_APP_MAXIMIZED = "GET_APP_MAXIMIZED"
export const GET_TITLEBAR_HIDE = "GET_TITLEBAR_HIDE"

export enum GET_APP_VERSION {
    REQUEST = "GET_APP_VERSION_REQUEST",
    SUCCESS = "GET_APP_VERSION_SUCCESS",
    FAILURE = "GET_APP_VERSION_FAILURE",
}

export enum GET_APP_PATHS {
    REQUEST = "GET_APP_PATHS_REQUEST",
    SUCCESS = "GET_APP_PATHS_SUCCESS",
    FAILURE = "GET_APP_PATHS_FAILURE",
}

export enum GET_APP_CPU_USAGE {
    REQUEST = "GET_APP_CPU_USAGE_REQUEST",
    SUCCESS = "GET_APP_CPU_USAGE_SUCCESS",
    FAILURE = "GET_APP_CPU_USAGE_FAILURE",
}

export enum GET_APP_SYSTEM_MEMORY {
    REQUEST = "GET_APP_SYSTEM_MEMORY_REQUEST",
    SUCCESS = "GET_APP_SYSTEM_MEMORY_SUCCESS",
    FAILURE = "GET_APP_SYSTEM_MEMORY_FAILURE",
}

export const AUTO_UPDATE_DOWNLOADED = "AUTO_UPDATE_DOWNLOADED"
export const AUTO_UPDATE_RESTART = "AUTO_UPDATE_RESTART"

export interface GetAppMaximizedAction {
    type: typeof GET_APP_MAXIMIZED
    maximized: boolean
}

export interface GetAppTitleBarHideAction {
    type: typeof GET_TITLEBAR_HIDE
    hide: boolean
}

export interface GetAppVersionAction {
    type: GET_APP_VERSION
    version?: Version
}

export interface GetAppPathsAction {
    type: GET_APP_PATHS
    paths?: AppPaths
}

export interface GetAppCpuUsageAction {
    type: GET_APP_CPU_USAGE
    usage?: CPUInfo
}

export interface GetAppSystemMemoryAction {
    type: GET_APP_SYSTEM_MEMORY
    usage?: SystemMemoryInfo
}

export interface AutoUpdateDownloadedAction {
    type: typeof AUTO_UPDATE_DOWNLOADED
    info: UpdateInfo
}

export const getVersion = (): GetAppVersionAction => {
    return { type: GET_APP_VERSION.REQUEST }
}

export const getAppPaths = (): GetAppPathsAction => {
    return { type: GET_APP_PATHS.REQUEST }
}

export const getCpuUsage = (): GetAppCpuUsageAction => {
    return { type: GET_APP_CPU_USAGE.REQUEST }
}

export const getSystemMemoryInfo = (): GetAppSystemMemoryAction => {
    return { type: GET_APP_SYSTEM_MEMORY.REQUEST }
}

export const updateApp = () => {
    return { type: AUTO_UPDATE_RESTART }
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
    | GetAppMaximizedAction
    | GetAppVersionAction
    | GetAppPathsAction
    | GetAppCpuUsageAction
    | GetAppSystemMemoryAction
    | AutoUpdateDownloadedAction
