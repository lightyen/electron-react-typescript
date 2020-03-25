import React from "react"
import { Provider } from "react-redux"
import LanguageProvider from "~/LanguageProvider"
import AppContainer from "~/layout/AppContainer"
import { configureStore } from "~/store"

import "~/scss/styles.scss"
import "~/css/styles.css"

const store = configureStore()

// Link to anchor with default browser
document.querySelector("body").addEventListener("click", event => {
    const element = event.target as HTMLElement
    if (element?.tagName === "A") {
        const e = element as HTMLAnchorElement
        const url = new URL(e.href)
        if (process.env.NODE_ENV === "development" && url.hostname === "localhost") {
            return
        }
        if (url.protocol === "file:") {
            return
        }
        event.preventDefault()
        window.electron.shell.openExternal(url.href)
    }
})

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
