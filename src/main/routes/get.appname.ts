import { IpcHandler } from "~/ipc"
import { appName } from "~/const"

export const getAppName: IpcHandler = () => {
	return appName
}
