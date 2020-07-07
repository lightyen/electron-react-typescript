import { app } from "electron"
import { appLogs, appPaths, appLocale, setDefaultBackgroundColor, setDefaultAutoUpdate } from "@shared/ipc"
import { promises as fs } from "fs"

appLogs.handle(async () => await fs.readFile(global.electron.log.transports.file.getFile().path, { encoding: "utf-8" }))
appPaths.handle(() => ({
	userData: app.getPath("userData"),
	temp: app.getPath("temp"),
	appData: app.getPath("appData"),
	cache: app.getPath("cache"),
	logs: app.getPath("logs"),
	home: app.getPath("home"),
	desktop: app.getPath("desktop"),
	documents: app.getPath("documents"),
	music: app.getPath("music"),
	pictures: app.getPath("pictures"),
	downloads: app.getPath("downloads"),
}))
appLocale.handle(() => app.getLocale())
setDefaultBackgroundColor.on((_, color) => global.storage.set("backgroundColor", color))
setDefaultAutoUpdate.on((_, enable) => global.storage.set("autoUpdate", enable))
