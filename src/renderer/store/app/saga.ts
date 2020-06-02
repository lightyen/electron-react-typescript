import { ipcChannel } from "~/store/saga"
import { request } from "~/ipc"
import { put, take, fork, call, takeEvery, takeLeading } from "redux-saga/effects"

import { chVersions } from "@/channels"

import {
	titlebarHideS,
	getAppVersion,
	getAppVersionS,
	getAppPathsS,
	getCpuUsageS,
	getSystemMemoryInfoS,
	updateAppS,
	windowMaximized,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
	updateApp,
} from "./action"
import { UpdateInfo } from "./model"

function* _getAppVersion() {
	try {
		const { data: versions } = yield call(chVersions.invoke)
		yield put(getAppVersionS({ versions }))
	} catch (e) {
		// do nothing
	}
}

function* _getAppPaths() {
	try {
		const paths = yield call(request, "get.paths")
		yield put(getAppPathsS({ paths }))
	} catch (e) {
		// do nothing
	}
}

function* _getCPUUsage() {
	try {
		const usage = yield call(request, "get.cpuusage")
		yield put(getCpuUsageS({ usage }))
	} catch (e) {
		// do nothing
	}
}

function* _getSystemMemory() {
	try {
		const usage = yield call(request, "get.memory")
		yield put(getSystemMemoryInfoS({ usage }))
	} catch (e) {
		// do nothing
	}
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
	} catch (e) {
		// do nothing
	}
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
	yield takeEvery(getAppVersion.type, _getAppVersion)
	yield takeEvery(getAppPaths.type, _getAppPaths)
	yield takeEvery(getCpuUsage.type, _getCPUUsage)
	yield takeEvery(getSystemMemoryInfo.type, _getSystemMemory)
	yield takeLeading(updateApp.type, updateRestart)
	yield fork(subscribeUpdateDownloaded)
	yield fork(subscribeWindowFullScreen)
	yield fork(subscribeWindowMaximized)
}
