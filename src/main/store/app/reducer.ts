import { createReducer } from "@reduxjs/toolkit"
import { getVersionsS } from "./action"

export interface AppStoreType {
	versions: { [key: string]: unknown }
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	versions: {},
}

export const app = createReducer(init, builder =>
	builder.addCase(getVersionsS, (state, { payload: { versions } }) => ({ ...state, ...versions })),
)
