import { ipcChannel } from "~/store/saga"
import { request } from "~/ipc"
import { put, take, fork, call, takeEvery, takeLeading } from "redux-saga/effects"

import {
	titlebarHideS,
	getAppVersionS,
	getAppPathsS,
	getCpuUsageS,
	getSystemMemoryInfoS,
	updateAppS,
	windowMaximized,
} from "./action"
import { UpdateInfo } from "./model"

function* getAppVersion() {
	try {
		const version = yield call(request, "get.versions")
		yield put(getAppVersionS({ version }))
	} catch (e) {}
}

function* getAppPaths() {
	try {
		const paths = yield call(request, "get.paths")
		yield put(getAppPathsS({ paths }))
	} catch (e) {}
}

function* getCPUUsage() {
	try {
		const usage = yield call(request, "get.cpuusage")
		yield put(getCpuUsageS({ usage }))
	} catch (e) {}
}

function* getSystemMemory() {
	try {
		const usage = yield call(request, "get.memory")
		yield put(getSystemMemoryInfoS({ usage }))
	} catch (e) {}
}

function* subscribeWindowFullScreen() {
	const chan = yield ipcChannel("window.fullscreen")
	while (true) {
		const isFullScreen: boolean = yield take(chan)
		yield put(titlebarHideS({ hide: isFullScreen }))
	}
}

function* subscribeUpdateDownloaded() {
	const chan = yield ipcChannel("update-downloaded")
	const info: UpdateInfo = yield take(chan)
	yield put(updateAppS({ info }))
}

function* updateRestart() {
	try {
		yield call(request, "update-restart")
	} catch (e) {}
}

function* subscribeWindowMaximized() {
	const maximized = yield call(request, "window.maximized")
	yield put(windowMaximized({ maximized }))

	const chan = yield ipcChannel("window.maximized")
	while (true) {
		const maximized = yield take(chan)
		yield put(windowMaximized({ maximized }))
	}
}

export default function* sagas() {
	yield takeEvery("GET_APP_VERSION_REQUEST", getAppVersion)
	yield takeEvery("GET_APP_PATHS_REQUEST", getAppPaths)
	yield takeEvery("GET_APP_CPU_USAGE_REQUEST", getCPUUsage)
	yield takeEvery("GET_APP_SYSTEM_MEMORY_REQUEST", getSystemMemory)
	yield takeLeading("AUTO_UPDATE_RESTART", updateRestart)
	yield fork(subscribeUpdateDownloaded)
	yield fork(subscribeWindowFullScreen)
	yield fork(subscribeWindowMaximized)
}
