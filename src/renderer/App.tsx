import React from "react"
import { Provider } from "react-redux"
import LanguageProvider from "~/LanguageProvider"
import AppContainer from "~/layout/AppContainer"
import { configureStore } from "~/store"

import "~/scss/styles.scss"
import "~/css/styles.css"

const store = configureStore()

export default function App() {
    return (
        <React.StrictMode>
            <Provider store={store}>
                <LanguageProvider>
                    <AppContainer />
                </LanguageProvider>
            </Provider>
        </React.StrictMode>
    )
}
