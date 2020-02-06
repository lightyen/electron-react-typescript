import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/layout/AppContainer"
import { configureStore, useAction, useSelector } from "~/store"

import { IntlProvider } from "react-intl"
import { setLocale, SET_LOCALE } from "~/store/i18n/action"
import { Locales } from "./store/i18n/languages"

import "~/scss/styles.scss"
import "~/css/styles.css"

const store = configureStore()

const LocaleProvider: React.FC = ({ children }) => {
    const name = useSelector(state => state.i18n.name)
    const messages = useSelector(state => state.i18n.messages)
    return (
        <IntlProvider locale={name} key={name} messages={messages as any}>
            {children}
        </IntlProvider>
    )
}

export default function App() {
    const [ready, setReady] = React.useState(false)

    React.useEffect(() => {
        store.subscribe(() => {
            const { i18n } = store.getState()
            if (i18n.status === SET_LOCALE.SUCCESS) {
                setReady(true)
            }
        })
        store.dispatch(setLocale(localStorage.getItem("language") as Locales))
    }, [])

    return (
        ready && (
            <Provider store={store} key={Math.random()}>
                <LocaleProvider>
                    <AppContainer />
                </LocaleProvider>
            </Provider>
        )
    )
}
