import React from "react"
import { hot } from "react-hot-loader/root"

import TitleBar from "./TitleBar"
import Viewer from "./Viewer"
import AutoUpdater from "./AutoUpdater"
import { ErrorBoundary } from "~/components/ErrorBoundary"

const AppContainer: React.FC = () => {
	return (
		<div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
			<TitleBar />
			<ErrorBoundary>
				<Viewer />
			</ErrorBoundary>
			<AutoUpdater />
		</div>
	)
}
export default hot(AppContainer)
