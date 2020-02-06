import React from "react"
import { IntlProvider } from "react-intl"
import { useSelector } from "~/store"

const LanguageProvider: React.FC = ({ children }) => {
    const name = useSelector(state => state.i18n.name)
    const messages = useSelector(state => state.i18n.messages)
    return (
        /* eslint-disable @typescript-eslint/no-explicit-any */
        <IntlProvider locale={name} key={name} messages={messages as any}>
            {children}
        </IntlProvider>
        /* eslint-enable @typescript-eslint/no-explicit-any */
    )
}

export default LanguageProvider
