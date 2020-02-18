import { ipcChannel } from "~/store/saga"
import { request } from "~/ipc"
import { put, take, fork, call, takeEvery, takeLeading } from "redux-saga/effects"

import {
    GET_APP_VERSION,
    GET_APP_PATHS,
    GET_TITLEBAR_HIDE,
    GET_APP_CPU_USAGE,
    GET_APP_SYSTEM_MEMORY,
    GetAppVersionAction,
    GetAppPathsAction,
    GetAppTitleBarHideAction,
    GetAppCpuUsageAction,
    GetAppSystemMemoryAction,
    AUTO_UPDATE_DOWNLOADED,
    AUTO_UPDATE_RESTART,
    AutoUpdateDownloadedAction,
} from "./action"
import { UpdateInfo } from "./model"

function* getAppVersion() {
    try {
        const version = yield call(request, "get.versions")
        yield put<GetAppVersionAction>({ type: GET_APP_VERSION.SUCCESS, version })
    } catch (e) {}
}

function* getAppPaths() {
    try {
        const paths = yield call(request, "get.paths")
        yield put<GetAppPathsAction>({ type: GET_APP_PATHS.SUCCESS, paths })
    } catch (e) {}
}

function* getCPUUsage() {
    try {
        const usage = yield call(request, "get.cpuusage")
        yield put<GetAppCpuUsageAction>({ type: GET_APP_CPU_USAGE.SUCCESS, usage })
    } catch (e) {}
}

function* getSystemMemory() {
    try {
        const usage = yield call(request, "get.memory")
        yield put<GetAppSystemMemoryAction>({ type: GET_APP_SYSTEM_MEMORY.SUCCESS, usage })
    } catch (e) {}
}

function* subscribeWindowFullScreen() {
    const chan = yield ipcChannel("window.fullscreen")
    while (true) {
        const isFullScreen: boolean = yield take(chan)
        yield put<GetAppTitleBarHideAction>({ type: GET_TITLEBAR_HIDE, hide: isFullScreen })
    }
}

function* subscribeUpdateDownloaded() {
    const chan = yield ipcChannel("update-downloaded")
    const info: UpdateInfo = yield take(chan)
    yield put<AutoUpdateDownloadedAction>({ type: AUTO_UPDATE_DOWNLOADED, info })
}

function* updateRestart() {
    try {
        yield call(request, "update-restart")
    } catch (e) {}
}

export default function* sagas() {
    yield takeEvery(GET_APP_VERSION.REQUEST, getAppVersion)
    yield takeEvery(GET_APP_PATHS.REQUEST, getAppPaths)
    yield takeEvery(GET_APP_CPU_USAGE.REQUEST, getCPUUsage)
    yield takeEvery(GET_APP_SYSTEM_MEMORY.REQUEST, getSystemMemory)
    yield takeLeading(AUTO_UPDATE_RESTART, updateRestart)
    yield fork(subscribeUpdateDownloaded)
    yield fork(subscribeWindowFullScreen)
}
