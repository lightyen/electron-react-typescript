import { IpcHandler } from "~/ipc"
import { appVersion } from "~/const"
import os from "os"

function getOS(): { name: string; version: string } {
    return { name: os.platform(), version: os.release() }
}

export const getVersions: IpcHandler = () => {
    // Experiment
    // const n = new Electron.Notification({
    //     title: "App Notification",
    //     body: "Hello world!",
    // })
    // n.show()
    // n.on("click", () => {
    //     log.info("click notification")
    // })
    return { ...process.versions, app: appVersion, os: getOS() }
}
