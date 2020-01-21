import { Reducer } from "redux"
import { Version, SystemMemoryInfo } from "./model"

import {
    Action,
    GET_TITLEBAR_HIDE,
    GET_APP_MAXIMIZED,
    GET_APP_VERSION,
    GET_APP_CPU_USAGE,
    GET_APP_SYSTEM_MEMORY,
} from "./action"

interface AppStoreType {
    maximized: boolean
    hide: boolean
    version: Version
    cpuusage: number
    memory: SystemMemoryInfo
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
    maximized: false,
    hide: false,
    version: {
        electron: "",
        chrome: "",
        node: "",
        os: { name: "", version: "" },
    },
    cpuusage: 0,
    memory: {
        free: 0,
        total: 0,
    },
}

export const appReducer: Reducer<AppStore, Action> = (state = init, action): AppStore => {
    switch (action.type) {
        case GET_TITLEBAR_HIDE:
            return { ...state, hide: action.hide }
        case GET_APP_MAXIMIZED:
            return { ...state, maximized: action.maximized }
        case GET_APP_VERSION.SUCCESS:
            return { ...state, version: action.version }
        case GET_APP_CPU_USAGE.SUCCESS:
            const { load } = action.usage
            const usage = load.user + load.sys + load.nice + load.irq
            return { ...state, cpuusage: usage }
        case GET_APP_SYSTEM_MEMORY.SUCCESS:
            return { ...state, memory: action.usage }
        default:
            return state
    }
}
