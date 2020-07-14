import React from "react"
import { appLogs } from "@shared/ipc"
import Page from "~/components/Page"

export default () => {
	const [log, setLog] = React.useState("")
	React.useEffect(() => {
		appLogs
			.invoke()
			.then(data => setLog(data))
			.catch(err => setLog(JSON.stringify(err, null, 2)))
	}, [])

	return (
		<Page>
			<p className="p-3" style={{ whiteSpace: "pre-wrap" }}>
				{log === "" ? "Empty" : log}
			</p>
		</Page>
	)
}
