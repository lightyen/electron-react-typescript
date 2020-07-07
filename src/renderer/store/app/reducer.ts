import { createReducer } from "@reduxjs/toolkit"
import { SystemMemoryInfo, AppPaths } from "@shared/model"
import {
	isFullscreenS,
	getAppPathsS,
	getCpuUsageS,
	getSystemMemoryInfoS,
	appNewVersion,
	windowMaximized,
} from "./action"

interface AppStoreType {
	isFullscreen: boolean
	paths: AppPaths
	cpuusage: number
	memory: SystemMemoryInfo
	update_downloaded: boolean
	update_version: string
	maximized: boolean
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	isFullscreen: false,
	maximized: false,
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

export const app = createReducer(init, builder =>
	builder
		.addCase(isFullscreenS, (s, { payload }) => ({ ...s, ...payload }))
		.addCase(getAppPathsS, (s, { payload }) => ({ ...s, ...payload }))
		.addCase(getCpuUsageS, (state, { payload }) => {
			const { load } = payload.usage
			state.cpuusage = load.user + load.sys + load.nice + load.irq
		})
		.addCase(getSystemMemoryInfoS, (s, { payload }) => ({ ...s, memory: payload.usage }))
		.addCase(appNewVersion, (s, { payload: { info } }) => ({
			...s,
			update_downloaded: true,
			update_version: info.version,
		}))
		.addCase(windowMaximized, (state, { payload: { maximized } }) => {
			state.maximized = maximized
		}),
)
