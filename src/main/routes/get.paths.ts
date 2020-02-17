import Electron from "electron"
import { IpcHandler } from "~/ipc"
import { appPath } from "~/const"

export const getPaths: IpcHandler = () => {
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