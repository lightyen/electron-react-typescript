import Electron from "electron"
import { appPaths } from "shared/ipc"

appPaths.handle(() => ({
	userData: Electron.app.getPath("userData"),
	temp: Electron.app.getPath("temp"),
	appData: Electron.app.getPath("appData"),
	cache: Electron.app.getPath("cache"),
	logs: Electron.app.getPath("logs"),
	home: Electron.app.getPath("home"),
	desktop: Electron.app.getPath("desktop"),
	documents: Electron.app.getPath("documents"),
	music: Electron.app.getPath("music"),
	pictures: Electron.app.getPath("pictures"),
	downloads: Electron.app.getPath("downloads"),
}))
