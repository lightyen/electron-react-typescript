import Electron from "electron"
import fs from "fs"
import os from "os"
import { promisify } from "util"
import log from "electron-log"

import { IpcHandler, IpcPromiseHandler } from "~/ipc"
import { appName, appPath, isDevMode } from "~/app"

export const getAppName: IpcHandler = () => {
    return appName
}

function getOS(): { name: string; version: string } {
    return { name: os.platform(), version: os.release() }
}

export const getPaths: IpcHandler = () => {
    console.log("getPath")
    return {
        home: Electron.app.getPath("home"),
        appData: Electron.app.getPath("appData"),
        temp: Electron.app.getPath("temp"),
        cache: Electron.app.getPath("cache"),
        desktop: Electron.app.getPath("desktop"),
        documents: Electron.app.getPath("documents"),
        music: Electron.app.getPath("music"),
        pictures: Electron.app.getPath("pictures"),
        downloads: Electron.app.getPath("downloads"),
        appPath: appPath,
        userData: Electron.app.getPath("userData"),
        logs: Electron.app.getPath("logs"),
        exe: Electron.app.getPath("exe"),
    }
}

export const getLog: IpcPromiseHandler<string> = async () =>
    await promisify(fs.readFile)(log.transports.file.getFile().path, { encoding: "utf-8" })

export const getVersions: IpcHandler = () => {
    const app = isDevMode() ? "unknown" : Electron.app.getVersion()
    // Experiment
    // const n = new Electron.Notification({
    //     title: "App Notification",
    //     body: "Hello world!",
    // })
    // n.show()
    // n.on("click", () => {
    //     log.info("click notification")
    // })
    return { ...process.versions, app, os: getOS() }
}

interface CPULoadInfo {
    tick: {
        user: number
        nice: number
        sys: number
        idle: number
        irq: number
    }
    load: {
        user: number
        nice: number
        sys: number
        idle: number
        irq: number
    }
}

const cpuLoadInfo: CPULoadInfo = {
    tick: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0,
    },
    load: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0,
    },
}

function updateCPULoad(load: CPULoadInfo) {
    const current = os
        .cpus()
        .map(v => v.times)
        .reduce((pre, cur) => {
            return {
                user: pre.user + cur.user,
                nice: pre.nice + cur.nice,
                sys: pre.sys + cur.sys,
                idle: pre.idle + cur.idle,
                irq: pre.irq + cur.irq,
            }
        })

    const total =
        current.user -
        load.tick.user +
        (current.nice - load.tick.nice) +
        (current.sys - load.tick.sys) +
        (current.idle - load.tick.idle) +
        (current.irq - load.tick.irq)

    if (total > 10) {
        load.load.user = (100.0 * (current.user - load.tick.user)) / total
        load.load.sys = (100.0 * (current.sys - load.tick.sys)) / total
        load.load.nice = (100.0 * (current.nice - load.tick.nice)) / total
        load.load.idle = (100.0 * (current.idle - load.tick.idle)) / total
        load.load.irq = (100.0 * (current.irq - load.tick.irq)) / total
    } else {
        load.load.user = load.load.sys = load.load.nice = load.load.idle = load.load.irq = 0
    }

    load.tick = current
}

export const getCPUUsage: IpcHandler = () => {
    updateCPULoad(cpuLoadInfo)
    return cpuLoadInfo
}

export const getSystemInfo: IpcHandler = () => {
    return {
        free: os.freemem(),
        total: os.totalmem(),
    }
}

export const openDirectoryDialog: IpcPromiseHandler = async (
    e: Electron.IpcMainEvent,
    options: Electron.OpenDialogOptions,
) => {
    options = {
        title: "Select a folder",
        properties: ["openDirectory"],
    }
    options = options || {}

    const { canceled, ...rest } = await Electron.dialog.showOpenDialog(
        Electron.BrowserWindow.fromWebContents(e.sender),
        options,
    )
    if (canceled) {
        return {
            ...rest,
            files: [],
        }
    }

    const list = await promisify(fs.readdir)(rest.filePaths[0])
    return {
        ...rest,
        files: list,
    }
}
