import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/layout/AppContainer"

import "~/css/style.css"
import "~/scss/style.scss"

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
