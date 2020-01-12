import { request, subscibeChannel, consoleChannel } from "~/ipc"
import { put, take, fork, all, call, takeEvery, select } from "redux-saga/effects"

import {
    GET_APP_MAXIMIZED,
    GET_APP_VERSION,
    GET_APP_ICON,
    GET_APP_LOGO,
    GET_TITLEBAR_HIDE,
    GET_APP_CPU_USAGE,
    GET_APP_SYSTEM_MEMORY,
    GetAppMaximizedAction,
    GetAppIconAction,
    GetAppLogoAction,
    GetAppVersionAction,
    GetAppTitleBarHideAction,
    GetAppCpuUsageAction,
    GetAppSystemMemoryAction,
} from "./action"

function* getAppVersion() {
    try {
        const version = yield call(request, "app.get-versions")
        yield put<GetAppVersionAction>({ type: GET_APP_VERSION.SUCCESS, version })
    } catch (e) {}
}

function* getCPUUsage() {
    try {
        const usage = yield call(request, "app.get-cpuusage")
        yield put<GetAppCpuUsageAction>({ type: GET_APP_CPU_USAGE.SUCCESS, usage })
    } catch (e) {}
}

function* getSystemMemory() {
    try {
        const usage = yield call(request, "app.get-sysmem-info")
        yield put<GetAppSystemMemoryAction>({ type: GET_APP_SYSTEM_MEMORY.SUCCESS, usage })
    } catch (e) {}
}

function* subscribeWindowFullScreen() {
    const chan = yield subscibeChannel("window.fullscreen")
    while (true) {
        const isFullScreen: boolean = yield take(chan)
        yield put<GetAppTitleBarHideAction>({ type: GET_TITLEBAR_HIDE, hide: isFullScreen })
    }
}

function* subscribeWindowMaxmized() {
    const chan = yield subscibeChannel("window.maximized")
    while (true) {
        const maximized: boolean = yield take(chan)
        yield put<GetAppMaximizedAction>({ type: GET_APP_MAXIMIZED, maximized })
    }
}

function* getAppIcon() {
    try {
        const icon = yield call(request, "app.icon")
        yield put<GetAppIconAction>({ type: GET_APP_ICON.SUCCESS, icon })
    } catch (e) {}
}

function* getAppLogo() {
    try {
        const src = yield call(request, "app.logo")
        yield put<GetAppLogoAction>({ type: GET_APP_LOGO.SUCCESS, src })
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
    yield takeEvery(GET_APP_CPU_USAGE.REQUEST, getCPUUsage)
    yield takeEvery(GET_APP_SYSTEM_MEMORY.REQUEST, getSystemMemory)
    yield takeEvery(GET_APP_ICON.REQUEST, getAppIcon)
    yield takeEvery(GET_APP_LOGO.REQUEST, getAppLogo)
    yield fork(subscribeWindowFullScreen)
    yield fork(subscribeWindowMaxmized)
    yield fork(sysemConsoleLog)
    yield fork(sysemConsoleWarning)
    yield fork(sysemConsoleError)
    yield fork(sysemConsoleClear)
}
