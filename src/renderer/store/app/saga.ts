import { request, subscribeChannel, consoleChannel } from "~/ipc"
import { put, take, fork, all, call, takeEvery, takeLeading } from "redux-saga/effects"

import {
    GET_APP_MAXIMIZED,
    GET_APP_VERSION,
    GET_APP_PATHS,
    GET_TITLEBAR_HIDE,
    GET_APP_CPU_USAGE,
    GET_APP_SYSTEM_MEMORY,
    GetAppMaximizedAction,
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
    const chan = yield subscribeChannel("window.fullscreen")
    while (true) {
        const isFullScreen: boolean = yield take(chan)
        yield put<GetAppTitleBarHideAction>({ type: GET_TITLEBAR_HIDE, hide: isFullScreen })
    }
}

function* subscribeWindowMaxmized() {
    const chan = yield subscribeChannel("window.maximized")
    while (true) {
        const maximized: boolean = yield take(chan)
        localStorage.setItem("maximized", `${maximized}`)
        yield put<GetAppMaximizedAction>({ type: GET_APP_MAXIMIZED, maximized })
    }
}

function* subscribeUpdateDownloaded() {
    const chan = yield subscribeChannel("update-downloaded")
    const info: UpdateInfo = yield take(chan)
    yield put<AutoUpdateDownloadedAction>({ type: AUTO_UPDATE_DOWNLOADED, info })
}

function* updateRestart() {
    try {
        yield call(request, "update-restart")
    } catch (e) {}
}

function* sysemConsoleLog() {
    const chan = yield consoleChannel("console.log")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.log(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleWarning() {
    const chan = yield consoleChannel("console.warn")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.warn(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleError() {
    const chan = yield consoleChannel("console.error")
    while (true) {
        const obj: { message: unknown; optionalParams: unknown[] } = yield take(chan)
        if (obj.message || obj.optionalParams.length) {
            console.error(obj.message, ...obj.optionalParams)
        }
    }
}

function* sysemConsoleClear() {
    const chan = yield consoleChannel("console.clear")
    while (true) {
        yield take(chan)
        console.clear()
    }
}

export default function* sagas() {
    yield takeEvery(GET_APP_VERSION.REQUEST, getAppVersion)
    yield takeEvery(GET_APP_PATHS.REQUEST, getAppPaths)
    yield takeEvery(GET_APP_CPU_USAGE.REQUEST, getCPUUsage)
    yield takeEvery(GET_APP_SYSTEM_MEMORY.REQUEST, getSystemMemory)
    yield takeLeading(AUTO_UPDATE_RESTART, updateRestart)
    yield fork(subscribeUpdateDownloaded)
    yield fork(subscribeWindowFullScreen)
    yield fork(subscribeWindowMaxmized)
    yield fork(sysemConsoleLog)
    yield fork(sysemConsoleWarning)
    yield fork(sysemConsoleError)
    yield fork(sysemConsoleClear)
}
