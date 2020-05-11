import React from "react"
import { Provider } from "react-redux"
import LanguageProvider from "~/LanguageProvider"
import AppContainer from "~/layout/AppContainer"
import { makeStore } from "~/store"

import "~/scss/styles.scss"
import "~/css/styles.css"

export default function App() {
	return (
		// <React.StrictMode>
		<Provider store={makeStore()}>
			<LanguageProvider>
				<AppContainer />
			</LanguageProvider>
		</Provider>
		// </React.StrictMode>
	)
}
