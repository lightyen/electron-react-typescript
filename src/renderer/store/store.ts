import { createStore, applyMiddleware, combineReducers, Middleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware from "redux-saga"

import rootSaga from "./saga"

import { AppStore, app } from "./app/reducer"
import { ThemeStore, theme } from "./theme/reducer"
import { LocaleStore, locale } from "./locale/reducer"

export interface RootStore {
    app: AppStore
    theme: ThemeStore
    locale: LocaleStore
}

export const rootReducer = combineReducers({
    app,
    theme,
    locale,
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

    module.hot?.accept(["~/store"], () => {
        store.replaceReducer(rootReducer)
    })
    module.hot?.accept(["~/store/saga"], () => {
        sagaTask.cancel()
        sagaTask.toPromise().then(() => {
            sagaTask = sagaMiddleware.run(rootSaga)
        })
    })

    return store
}
