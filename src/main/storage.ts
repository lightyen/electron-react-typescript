import ElectronStore from "electron-store"
import { StorageType } from "@shared/model/storage"

export function createStorage() {
	return new ElectronStore<StorageType>({
		defaults: {
			autoUpdate: false,
			backgroundColor: "#f7fafc",
		},
	})
}

export type AppStorage = ReturnType<typeof createStorage>
