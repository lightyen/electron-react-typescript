import { app } from "electron"
import { getAppLocale } from "shared/ipc"

getAppLocale.handle(() => app.getLocale())
