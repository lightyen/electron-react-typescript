import { Reducer } from "redux"
import { Action, GET_VERSIONS } from "./action"

export interface AppStoreType {
	versions: { [key: string]: unknown }
}

export type AppStore = Readonly<AppStoreType>

const init: AppStore = {
	versions: {},
}

export const app: Reducer<AppStore, Action> = (state = init, action) => {
	switch (action.type) {
		case GET_VERSIONS:
			return { ...state, versions: action.versions }
		default:
			return state
	}
}
