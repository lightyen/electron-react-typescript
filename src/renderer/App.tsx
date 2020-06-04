import React from "react"
import { Provider } from "react-redux"
import LanguageProvider from "~/LanguageProvider"
import AppLayout from "~/layout/AppLayout"
import { makeStore } from "~/store"

import "~/css/styles.css"

export default function App() {
	return (
		<React.StrictMode>
			<Provider store={makeStore()}>
				<LanguageProvider>
					<AppLayout />
				</LanguageProvider>
			</Provider>
		</React.StrictMode>
	)
}
