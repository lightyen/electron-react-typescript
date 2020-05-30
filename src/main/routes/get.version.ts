import { store } from "~/store"

export const getVersions = () => {
	const versions = store.getState().app.versions
	return versions
}
