import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga"
import { reducer } from "./reducer"
import rootSaga from "./saga"

export function makeStore() {
	const sagaMiddleware = createSagaMiddleware()
	const store = configureStore({
		reducer,
		middleware: [sagaMiddleware],
		preloadedState: undefined,
		devTools: process.env.NODE_ENV === "development" ? { name: "react is awesome" } : false,
	})

	sagaMiddleware.run(rootSaga)
	return store
}
