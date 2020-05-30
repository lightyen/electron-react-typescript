import type { IpcMainEvent } from "electron"
import { appName } from "~/const"

export const getAppName = (e: IpcMainEvent) => {
	return appName
}
