import React from "react"
import Back from "~/components/Back"
import { request } from "~/ipc"
import { useSelector } from "~/store"

const Page: React.FC = () => {
	const color = useSelector(state => state.theme.textColor)
	const [log, setLog] = React.useState("")
	React.useEffect(() => {
		request<string>("get.log")
			.then(data => setLog(data))
			.catch(err => setLog(JSON.stringify(err, null, 2)))
	}, [])

	return (
		<div>
			<Back to="/version" />
			<p className="p-3" style={{ color, whiteSpace: "pre-wrap" }}>
				{log === "" ? "Empty" : log}
			</p>
		</div>
	)
}

export default Page
