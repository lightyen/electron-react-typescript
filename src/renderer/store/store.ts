import { configureStore } from "@reduxjs/toolkit"
import reducer from "./reducer"
import createSagaMiddleware from "redux-saga"
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

	// NOTE: seems not work in electron

	// if (module.hot) {
	// 	module.hot.accept("~/store/reducer", () => {
	// 		console.log("@@HMR reducer")
	// 		store.replaceReducer(reducer)
	// 	})
	// 	module.hot.accept("~/store/saga", () => {
	// 		console.log("@@HMR saga")
	// 		sagaTask.cancel()
	// 		sagaTask.toPromise().then(() => {
	// 			sagaTask = sagaMiddleware.run(rootSaga)
	// 		})
	// 	})
	// }

	return store
}
