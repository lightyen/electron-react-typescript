import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/AppContainer"

import "~/scss/style.scss"
import "bootstrap"

import { configureStore, rootReducer } from "~/store"

const store = configureStore()

if (module["hot"]) {
    module["hot"].accept(["~/store"], (e: string[]) => {
        store.replaceReducer(rootReducer)
    })
}

const App = () => {
    return (
        <Provider store={store} key={Math.random()}>
            <AppContainer />
        </Provider>
    )
}

export default App
