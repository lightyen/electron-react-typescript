import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/layout/AppContainer"

import "~/css/style.css"
import "~/scss/style.scss"

import { configureStore } from "~/store"

const store = configureStore()

const App = () => {
    return (
        <Provider store={store} key={Math.random()}>
            <AppContainer />
        </Provider>
    )
}

export default App
