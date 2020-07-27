import React from "react"
import { Provider } from "react-redux"
import StyledThemeProvider from "~/components/StyledThemeProvider"
import LanguageProvider from "~/components/LanguageProvider"
import AppLayout from "~/layout/AppLayout"
import { makeStore } from "~/store/store"
import { Global, css } from "@emotion/core"
import tw from "twin.macro"

import FiraCodeFont from "assets/fonts/FiraCode-Regular.woff2"
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
	body {
		margin: 0;
		height: 100vh;
		width: 100vw;
		overflow: hidden;

		font-family: Roboto, 微軟正黑體, Microsoft JhengHei, Helvetica Neue, Helvetica, Arial, PingFang TC, 黑體-繁,
			Heiti TC, 蘋果儷中黑, Apple LiGothic Medium, sans-serif;
	}
	@font-face {
		font-family: Fira Code;
		src: url(${FiraCodeFont}) format("woff2");
	}
`

function useExternalLink() {
	React.useEffect(() => {
		// Link to anchor with default browser
		const h = (event: MouseEvent) => {
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
		}
		document.documentElement.addEventListener("click", h)
		return () => document.documentElement.removeEventListener("click", h)
	}, [])
}

export default function App() {
	useExternalLink()
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
