import React from "react"
import { Provider } from "react-redux"
import AppContainer from "~/layout/AppContainer"
import { configureStore, useAction, useSelector } from "~/store"
import { IntlProvider } from "react-intl"

import "~/scss/styles.scss"
import "~/css/styles.css"

const store = configureStore()

const LocaleProvider: React.FC = ({ children }) => {
    const name = useSelector(state => state.locale.name)
    const messages = useSelector(state => state.locale.messages)
    return (
        <IntlProvider locale={name} key={name} messages={messages as any}>
            {children}
        </IntlProvider>
    )
}

export default function App() {
    return (
        <Provider store={store} key={Math.random()}>
            <LocaleProvider>
                <AppContainer />
            </LocaleProvider>
        </Provider>
    )
}
