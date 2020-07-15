import React from "react"
import { Provider } from "react-redux"
import StyledThemeProvider from "~/StyledThemeProvider"
import LanguageProvider from "~/LanguageProvider"
import AppLayout from "~/layout/AppLayout"
import { makeStore } from "~/store"
import { Global, css } from "@emotion/core"
import tw from "twin.macro"

import "tailwindcss/dist/base.min.css"

const globalStyle = css`
	:root {
		--control-ratio: 1;
		--titlebar-height: (var(--control-ratio) * 30px);
		--footer-height: (var(--control-ratio) * 0px);
	}
	#modal-root {
		${tw`absolute left-0 right-0 top-0`}
		bottom: 100%;
	}
	@font-face {
		font-family: Fira Code;
		src: url(~assets/fonts/FiraCode-Regular.woff2);
	}
	body {
		margin: 0;
		height: 100vh;
		width: 100vw;
		overflow: hidden;

		font-family: Roboto, 微軟正黑體, Microsoft JhengHei, Helvetica Neue, Helvetica, Arial, PingFang TC, 黑體-繁,
			Heiti TC, 蘋果儷中黑, Apple LiGothic Medium, sans-serif;
	}
`

export default function App() {
	return (
		<React.StrictMode>
			<Global styles={globalStyle} />
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
