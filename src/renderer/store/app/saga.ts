import { ipcChannel } from "~/store/saga"
import { request } from "~/ipc"
import { put, take, fork, call, takeEvery, takeLeading } from "redux-saga/effects"

<<<<<<< HEAD
import { titlebarHideS, getAppVersionS, getAppPathsS, getCpuUsageS, getSystemMemoryInfoS, updateAppS } from "./action"
=======
import { Action } from "./action"
>>>>>>> da5d1921b01e68b1a95fea2fdd3010f3e0c4c32e
import { UpdateInfo } from "./model"

function* getAppVersion() {
	try {
		const version = yield call(request, "get.versions")
<<<<<<< HEAD
		yield put(getAppVersionS({ version }))
=======
		yield put<Action>({ type: "GET_APP_VERSION_SUCCESS", version })
>>>>>>> da5d1921b01e68b1a95fea2fdd3010f3e0c4c32e
	} catch (e) {}
}

function* getAppPaths() {
	try {
		const paths = yield call(request, "get.paths")
<<<<<<< HEAD
		yield put(getAppPathsS({ paths }))
=======
		yield put<Action>({ type: "GET_APP_PATHS_SUCCESS", paths })
>>>>>>> da5d1921b01e68b1a95fea2fdd3010f3e0c4c32e
	} catch (e) {}
}

function* getCPUUsage() {
	try {
		const usage = yield call(request, "get.cpuusage")
<<<<<<< HEAD
		yield put(getCpuUsageS({ usage }))
=======
		yield put<Action>({ type: "GET_APP_CPU_USAGE_SUCCESS", usage })
>>>>>>> da5d1921b01e68b1a95fea2fdd3010f3e0c4c32e
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

export default function* sagas() {
	yield takeEvery("GET_APP_VERSION_REQUEST", getAppVersion)
	yield takeEvery("GET_APP_PATHS_REQUEST", getAppPaths)
	yield takeEvery("GET_APP_CPU_USAGE_REQUEST", getCPUUsage)
	yield takeEvery("GET_APP_SYSTEM_MEMORY_REQUEST", getSystemMemory)
	yield takeLeading("AUTO_UPDATE_RESTART", updateRestart)
	yield fork(subscribeUpdateDownloaded)
	yield fork(subscribeWindowFullScreen)
}
