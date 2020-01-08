import { Version, CPUInfo, SystemMemoryInfo } from "./model"

export const GET_APP_MAXIMIZED = "GET_APP_MAXIMIZED"
export const GET_TITLEBAR_HIDE = "GET_TITLEBAR_HIDE"

export enum GET_APP_VERSION {
    REQUEST = "GET_APP_VERSION_REQUEST",
    SUCCESS = "GET_APP_VERSION_SUCCESS",
    FAILURE = "GET_APP_VERSION_FAILURE",
}

export enum GET_APP_ICON {
    REQUEST = "GET_APP_ICON_REQUEST",
    SUCCESS = "GET_APP_ICON_SUCCESS",
    FAILURE = "GET_APP_ICON_FAILURE",
}

export enum GET_APP_LOGO {
    REQUEST = "GET_APP_LOGO_REQUEST",
    SUCCESS = "GET_APP_LOGO_SUCCESS",
    FAILURE = "GET_APP_LOGO_FAILURE",
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

export interface GetAppIconAction {
    type: GET_APP_ICON
    icon?: string
}

export interface GetAppLogoAction {
    type: GET_APP_LOGO
    src?: string
}

export interface GetAppCpuUsageAction {
    type: GET_APP_CPU_USAGE
    usage?: CPUInfo
}

export interface GetAppSystemMemoryAction {
    type: GET_APP_SYSTEM_MEMORY
    usage?: SystemMemoryInfo
}

export const getVersion = (): GetAppVersionAction => {
    return { type: GET_APP_VERSION.REQUEST }
}

export const getCpuUsage = (): GetAppCpuUsageAction => {
    return { type: GET_APP_CPU_USAGE.REQUEST }
}

export const getSystemMemoryInfo = (): GetAppSystemMemoryAction => {
    return { type: GET_APP_SYSTEM_MEMORY.REQUEST }
}

const actionCreators = {
    getVersion,
    getCpuUsage,
    getSystemMemoryInfo,
}

export default actionCreators

export type Action =
    | GetAppTitleBarHideAction
    | GetAppMaximizedAction
    | GetAppVersionAction
    | GetAppIconAction
    | GetAppLogoAction
    | GetAppCpuUsageAction
    | GetAppSystemMemoryAction
