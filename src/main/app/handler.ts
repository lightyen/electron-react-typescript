import Electron from "electron"
import fs from "fs"
import os from "os"
import { promisify } from "util"
import { serializeError } from "serialize-error"

import { IpcHandler, IpcPromiseHandler } from "~/ipc"
import { appName, appPath, Console, isDevMode } from "~/app"

export const getAppName: IpcHandler = () => {
    return { data: appName }
}

function getOS(): { name: string; version: string } {
    // Console.log("home", Electron.app.getPath("home"))
    // Console.log("appData", Electron.app.getPath("appData"))
    // Console.log("temp", Electron.app.getPath("temp"))
    // Console.log("cache", Electron.app.getPath("cache"))
    // Console.log("desktop", Electron.app.getPath("desktop"))
    // Console.log("documents", Electron.app.getPath("documents"))
    // Console.log("music", Electron.app.getPath("music"))
    // Console.log("pictures", Electron.app.getPath("pictures"))
    // Console.log("downloads", Electron.app.getPath("downloads"))

    // have difference on production
    // Console.log("appPath", appPath)
    // Console.log("userData", Electron.app.getPath("userData"))
    // Console.log("logs", Electron.app.getPath("logs"))
    // Console.log("exe", Electron.app.getPath("exe"))
    return { name: os.platform(), version: os.release() }
}

export const getVersions: IpcHandler = () => {
    const app = isDevMode() ? "unknown" : Electron.app.getVersion()
    return { data: { ...process.versions, app, os: getOS() } }
}

interface SysMemInfo {
    free: number
    total: number
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
    return { data: cpuLoadInfo }
}

export const getSystemInfo: IpcHandler = () => {
    const info: SysMemInfo = {
        free: os.freemem(),
        total: os.totalmem(),
    }
    return { data: info }
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

    try {
        const { canceled, ...rest } = await Electron.dialog.showOpenDialog(
            Electron.BrowserWindow.fromWebContents(e.sender),
            options,
        )
        if (canceled) {
            return {
                data: {
                    ...rest,
                    files: [],
                },
            }
        }

        const list = await promisify(fs.readdir)(rest.filePaths[0])
        return {
            data: {
                ...rest,
                files: list,
            },
        }
    } catch (e) {
        return {
            error: serializeError(e),
        }
    }
}
