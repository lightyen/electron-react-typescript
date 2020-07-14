import React from "react"
import { hot } from "react-hot-loader/root"

import TitleBar from "./TitleBar"
import AutoUpdater from "./AutoUpdater"
import ErrorBoundary from "~/components/ErrorBoundary"
import { AppRouter } from "~/router"
import StatusBar from "./StatusBar"
import Sider from "./Sider"
import { HashRouter } from "react-router-dom"

import styled from "@emotion/styled"
import tw from "twin.macro"

const View = styled.div`
	height: calc(100vh - var(--titlebar-height) - var(--footer-height));
`

const Main = tw.div`h-full w-full flex`

const AppLayout: React.FC = () => {
	return (
		<div className="overflow-hidden">
			<TitleBar />
			<HashRouter>
				<View>
					<Main>
						<Sider />
						<ErrorBoundary>
							<AppRouter />
						</ErrorBoundary>
					</Main>
					<AutoUpdater />
				</View>
				<StatusBar hide />
			</HashRouter>
		</div>
	)
}

export default hot(AppLayout)
