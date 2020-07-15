import React from "react"
import { appLogs } from "@shared/ipc"
import Page from "~/components/Page"
import tw from "twin.macro"

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
			<p css={tw`p-3 whitespace-pre-wrap`}>{log === "" ? "Empty" : log}</p>
		</Page>
	)
}
