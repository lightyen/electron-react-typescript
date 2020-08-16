import React from "react"
import { IntlProvider } from "react-intl"
import { useI18n } from "~/store/hooks"
import { getLocaleMessages } from "~/store/i18n/languages"

const LanguageProvider: React.FC = ({ children }) => {
	const { locale } = useI18n()
	return (
		<IntlProvider
			// key={locale}
			locale={locale}
			messages={getLocaleMessages(locale)}
		>
			{children}
		</IntlProvider>
	)
}

export default LanguageProvider
