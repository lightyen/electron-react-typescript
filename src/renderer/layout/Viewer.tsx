import React from "react"
import { AppRouter } from "~/router"

const Viewer: React.FC = () => {
	return (
		<div style={{ flexGrow: 1, transition: "all 0.2s ease" }}>
			<AppRouter />
		</div>
	)
}

export default Viewer
