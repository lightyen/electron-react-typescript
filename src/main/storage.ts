import ElectronStore from "electron-store"
import { StorageType } from "shared/model/storage"

export function createStorage() {
	return new ElectronStore<StorageType>({
		defaults: {
			autoUpdate: false,
			backgroundColor: "#1a202c",
		},
	})
}

export type AppStorage = ReturnType<typeof createStorage>
