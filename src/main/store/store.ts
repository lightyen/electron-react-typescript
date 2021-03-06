import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { AppStore, app } from "./app/reducer"
import createSagaMiddleware from "redux-saga"
import rootSagas from "./sagas"

export interface RootStore {
	app: AppStore
}

const reducer = combineReducers({
	app,
})

function makeStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer,
		middleware: [sagaMiddleware],
		preloadedState: undefined,
		devTools: false,
	})
	sagaMiddleware.run(rootSagas)
	return store
}

export const store = makeStore()
