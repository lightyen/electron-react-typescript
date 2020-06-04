import React from "react"
import { hot } from "react-hot-loader/root"

import TitleBar from "./TitleBar"
import AutoUpdater from "./AutoUpdater"
import { ErrorBoundary } from "~/components/ErrorBoundary"
import { AppRouter } from "~/router"
import StatusBar from "./StatusBar"

const AppLayout: React.FC = () => {
	return (
		<div className="overflow-hidden">
			<TitleBar />
			<div className="view">
				<ErrorBoundary>
					<AppRouter />
				</ErrorBoundary>
				<AutoUpdater />
			</div>
			<StatusBar hide />
		</div>
	)
}

export default hot(AppLayout)
