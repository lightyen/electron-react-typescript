import { put, take, fork, call, takeEvery } from "redux-saga/effects"
import {
	isFullscreenS,
	getAppVersion,
	getAppVersionS,
	getAppPathsS,
	getCpuUsageS,
	getSystemMemoryInfoS,
	appNewVersion,
	windowMaximized,
	getAppPaths,
	getCpuUsage,
	getSystemMemoryInfo,
} from "./action"

import {
	appVersions,
	autoUpdateDownloaded,
	windowIsMaximized,
	windowFullscreen,
	appPaths,
	cpuInfo,
	memoryUsage,
} from "shared/ipc"

function* _getAppVersion() {
	try {
		const versions = yield call(appVersions.invoke)
		yield put(getAppVersionS({ versions }))
	} catch (e) {
		// do nothing
	}
}

function* _getAppPaths() {
	try {
		const paths = yield call(appPaths.invoke)
		yield put(getAppPathsS({ paths }))
	} catch (e) {
		// do nothing
	}
}

function* _getCPUUsage() {
	try {
		const usage = yield call(cpuInfo.invoke)
		yield put(getCpuUsageS({ usage }))
	} catch (e) {
		// do nothing
	}
}

function* _getSystemMemory() {
	try {
		const usage = yield call(memoryUsage.invoke)
		yield put(getSystemMemoryInfoS({ usage }))
	} catch (e) {
		// do nothing
	}
}

function* subscribeWindowFullScreen() {
	const h = getComputedStyle(document.documentElement).getPropertyValue("--control-ratio")
	const chan = yield windowFullscreen.saga()
	while (true) {
		const isFullScreen: boolean = yield take(chan)
		if (isFullScreen) {
			document.documentElement.style.setProperty("--control-ratio", "0")
		} else {
			document.documentElement.style.setProperty("--control-ratio", h)
		}
		yield put(isFullscreenS({ isFullScreen }))
	}
}

function* subscribeUpdateDownloaded() {
	const chan = yield autoUpdateDownloaded.saga()
	const info = yield take(chan)
	yield put(appNewVersion({ info }))
}

function* subscribeWindowMaximized() {
	const { data } = yield call(windowIsMaximized.invoke)
	yield put(windowMaximized({ maximized: data }))

	const chan = yield windowIsMaximized.saga()
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
	yield fork(subscribeUpdateDownloaded)
	yield fork(subscribeWindowFullScreen)
	yield fork(subscribeWindowMaximized)
}
