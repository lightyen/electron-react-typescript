import { createStore, applyMiddleware, Middleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware from "redux-saga"
import { RootAction } from "./action"
import { rootReducer } from "./reducer"
export * from "./hooks"

import rootSaga from "./saga"

export function configureStore() {
    const sagaMiddleware = createSagaMiddleware()
    const middlewares: Middleware[] = [sagaMiddleware]
    const storeEnhancers = applyMiddleware(...middlewares)
    const composeEnhancers = composeWithDevTools({
        // Specify name here, actionsBlacklist, actionsCreators and other options if needed
        name: "react is awesome",
    })
    const store = createStore(
        rootReducer,
        undefined,
        process.env.NODE_ENV === "development" ? composeEnhancers(storeEnhancers) : storeEnhancers,
    )
    let sagaTask = sagaMiddleware.run(rootSaga)
    module.hot?.accept([require.resolve("~/store/reducer")], () => {
        console.log("hot replacement root reducer")
        store.replaceReducer(rootReducer)
    })
    module.hot?.accept(require.resolve("~/store/saga"), () => {
        console.log("hot replacement redux-saga")
        sagaTask.cancel()
        sagaTask.toPromise().then(() => {
            sagaTask = sagaMiddleware.run(rootSaga)
        })
    })

    return store
}
