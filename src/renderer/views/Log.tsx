import React from "react"
import { appLogs } from "@shared/ipc"

export default () => {
	const [log, setLog] = React.useState("")
	React.useEffect(() => {
		appLogs
			.invoke()
			.then(data => setLog(data))
			.catch(err => setLog(JSON.stringify(err, null, 2)))
	}, [])

	return (
		<div>
			<p className="p-3" style={{ whiteSpace: "pre-wrap" }}>
				{log === "" ? "Empty" : log}
			</p>
		</div>
	)
}