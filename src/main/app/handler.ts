import Electron from "electron"
import { execSync } from "child_process"
import fs from "fs"
import os from "os"
import path from "path"
import { promisify } from "util"
import { serializeError } from "serialize-error"

import { IpcHandler, IpcPromiseHandler } from "~/ipc"
import { appName, appPath } from "~/app"

export const getAppName: IpcHandler = () => {
    return { data: appName }
}

export const getAppIcon: IpcPromiseHandler = async e => {
    const readFile = promisify(fs.readFile)

    try {
        const buffer = await readFile(path.join(appPath, "assets", "appicons", "64x64.png"))
        return { data: buffer.toString("base64") }
    } catch (err) {
        return { error: serializeError(err) }
    }
}

export const getAppLogo: IpcPromiseHandler = async e => {
    const readFile = promisify(fs.readFile)
    try {
        const buffer = await readFile(path.join(appPath, "assets", "images", "logo.svg"))
        return { data: buffer.toString("base64") }
    } catch (err) {
        return { error: serializeError(err) }
    }
}

interface LSBRelease {
    /** LSB Version */
    version: string
    /** Distributor ID */
    id: string
    description: string
    /** Release Version */
    release: string
    codename: string
}

function getOS(): { name: string; version: string } {
    switch (process.platform) {
        case "linux":
            const lsbRelease = execSync("lsb_release -a").toString()
            const lines = lsbRelease.split(/\r\n|\r|\n/, 5)
            const info: LSBRelease = {
                version: "",
                id: "",
                description: "",
                release: "",
                codename: "",
            }
            for (const line of lines) {
                const words = line.split(":").map(w => w.trim())
                if (words.length !== 2) {
                    continue
                }
                if (/version/i.test(words[0])) {
                    info.version = words[1]
                } else if (/id/i.test(words[0])) {
                    info.id = words[1]
                } else if (/description/i.test(words[0])) {
                    info.description = words[1]
                } else if (/release/i.test(words[0])) {
                    info.release = words[1]
                } else if (/codename/i.test(words[0])) {
                    info.codename = words[1]
                }
            }
            return { name: "Linux", version: info.release }
        case "win32":
            return { name: "Windows", version: os.release() }
        case "darwin":
            // https://en.wikipedia.org/wiki/Darwin_%28operating_system%29#Release_history
            return { name: "darwin", version: os.release() }
        default:
            return { name: "", version: "" }
    }
}

export const getVersions: IpcHandler = () => {
    return { data: { ...process.versions, os: getOS() } }
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
