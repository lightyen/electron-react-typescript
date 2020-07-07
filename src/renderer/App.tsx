import React from "react"
import { Provider } from "react-redux"
import StyledThemeProvider from "~/StyledThemeProvider"
import LanguageProvider from "~/LanguageProvider"
import AppLayout from "~/layout/AppLayout"
import { makeStore } from "~/store"

import "~/css/styles.css"

export default function App() {
	return (
		<React.StrictMode>
			<Provider store={makeStore()}>
				<StyledThemeProvider>
					<LanguageProvider>
						<AppLayout />
					</LanguageProvider>
				</StyledThemeProvider>
			</Provider>
		</React.StrictMode>
	)
}
