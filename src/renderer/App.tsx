import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/layout/AppContainer"
import { configureStore } from "~/store"

import "~/scss/styles.scss"
import "~/css/styles.css"

const store = configureStore()

export default function App() {
    return (
        <Provider store={store} key={Math.random()}>
            <AppContainer />
        </Provider>
    )
}
