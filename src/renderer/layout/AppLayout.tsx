import React from "react"
import { hot } from "react-hot-loader/root"

import TitleBar from "./TitleBar"
import AutoUpdater from "./AutoUpdater"
import ErrorBoundary from "~/components/ErrorBoundary"
import { AppRouter } from "~/router"
import StatusBar from "./StatusBar"
import Sider from "./Sider"
import { HashRouter } from "react-router-dom"

const AppLayout: React.FC = () => {
	return (
		<div className="overflow-hidden">
			<TitleBar />
			<HashRouter>
				<div className="view">
					<div className="h-full w-full flex">
						<Sider />
						<ErrorBoundary>
							<AppRouter />
						</ErrorBoundary>
					</div>
					<AutoUpdater />
				</div>
				<StatusBar hide />
			</HashRouter>
		</div>
	)
}

export default hot(AppLayout)
