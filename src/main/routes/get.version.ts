import { IpcHandler } from "~/ipc"
import { store } from "~/store"

export const getVersions: IpcHandler = () => {
	const versions = store.getState().app.versions
	return versions
}
