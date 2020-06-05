import { app } from "electron"
import { appPaths } from "shared/ipc"

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
