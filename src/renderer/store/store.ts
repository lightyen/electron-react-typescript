import { createStore, applyMiddleware, combineReducers, Middleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { History } from "history"
import createSagaMiddleware from "redux-saga"

import rootSaga from "./saga"

import { AppStore, appReducer } from "./app/reducer"
import { ThemeStore, themeReducer } from "./theme/reducer"

export interface RootStore {
    app: AppStore
    theme: ThemeStore
}

export const rootReducer = combineReducers({
    app: appReducer,
    theme: themeReducer,
})

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

    if (module["hot"]) {
        module["hot"].accept(["~/store"], (e: string[]) => {
            store.replaceReducer(rootReducer)
        })
        module["hot"].accept(["~/store/saga"], () => {
            sagaTask.cancel()
            sagaTask.toPromise().then(() => {
                sagaTask = sagaMiddleware.run(rootSaga)
            })
        })
    }

    return store
}
