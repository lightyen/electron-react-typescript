import { createReducer } from "@reduxjs/toolkit"
import { Versions } from "shared/model"

export interface AppStoreType {
	versions: Versions
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	versions: {
		app: "",
		electron: "",
		node: "",
		chrome: "",
		os: { name: "", version: "" },
	},
}

export const app = createReducer(init, builder => builder)
