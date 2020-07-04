import { createReducer } from "@reduxjs/toolkit"

export interface AppStoreType {}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	// cache something...
}

export const app = createReducer(init, builder => builder)
