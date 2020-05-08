import { Reducer } from "redux"
import { Version, SystemMemoryInfo, AppPaths } from "./model"

import { Action } from "./action"

interface AppStoreType {
	hide: boolean
	version: Version
	paths: AppPaths
	cpuusage: number
	memory: SystemMemoryInfo
	update_downloaded: boolean
	update_version: string
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	hide: false,
	version: {
		app: "",
		electron: "",
		chrome: "",
		node: "",
		os: { name: "", version: "" },
	},
	paths: {
		home: "",
		appData: "",
		temp: "",
		cache: "",
		desktop: "",
		documents: "",
		music: "",
		pictures: "",
		downloads: "",
		userData: "",
		logs: "",
	},
	cpuusage: 0,
	memory: {
		free: 0,
		total: 0,
	},
	update_downloaded: false,
	update_version: "",
}

export const app: Reducer<AppStore, Action> = (state = init, action): AppStore => {
	switch (action.type) {
		case "GET_TITLEBAR_HIDE":
			return { ...state, hide: action.hide }
		case "GET_APP_VERSION_SUCCESS":
			return { ...state, version: action.version }
		case "GET_APP_PATHS_SUCCESS":
			return { ...state, paths: action.paths }
		case "GET_APP_CPU_USAGE_SUCCESS":
			const { load } = action.usage
			const usage = load.user + load.sys + load.nice + load.irq
			return { ...state, cpuusage: usage }
		case "GET_APP_SYSTEM_MEMORY_SUCCESS":
			return { ...state, memory: action.usage }
		case "AUTO_UPDATE_DOWNLOADED":
			return { ...state, update_downloaded: true, update_version: action.info.version }
		default:
			return state
	}
}
