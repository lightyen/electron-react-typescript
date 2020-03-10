import ElectronStore from "electron-store"

interface StoreType {
    autoUpdate: boolean
    backgroundColor: string
}

export const storage = new ElectronStore<StoreType>({
    defaults: {
        autoUpdate: false,
        backgroundColor: "#1a202c",
    },
})

import { createStore, applyMiddleware, combineReducers, Middleware } from "redux"
import { AppStore, app } from "./app/reducer"
import createSagaMiddleware from "redux-saga"
import rootSagas from "./sagas"

export interface RootStore {
    app: AppStore
}

const rootReducer = combineReducers({
    app,
})

function configureStore() {
    const sagaMiddleware = createSagaMiddleware()
    const middlewares: Middleware[] = [sagaMiddleware]
    const storeEnhancers = applyMiddleware(...middlewares)
    const store = createStore(rootReducer, undefined, storeEnhancers)
    sagaMiddleware.run(rootSagas)
    return store
}

export const store = configureStore()
