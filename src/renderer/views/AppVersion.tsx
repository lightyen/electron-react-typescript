import React from "react"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction } from "~/store"

interface Versions {
	electron: string
	node: string
	chrome: string
}

const AppVersion: React.FC = () => {
	const versions = useSelector(state => state.app.versions)
	const { getAppVersion } = useAction().app
	const backgroundColor = useSelector(state => state.theme.surface)
	const color = useSelector(state => state.theme.text.surface)
	React.useEffect(() => {
		getAppVersion()
	}, [getAppVersion])
	return (
		<div className="select-text p-3 text-center" style={{ backgroundColor, color }}>
			<h1 className="font-bold" style={{ textTransform: "capitalize", fontSize: "1.5em" }}>
				<FormattedMessage id="version" />
			</h1>
			<table className="w-full">
				<thead className="text-center" style={{ height: 20 }}>
					<tr>
						<th>Name</th>
						<th>Number</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className="border border-gray-500">Version</td>
						<td className="border border-gray-500">{versions.app}</td>
					</tr>
					<tr>
						<td className="border border-gray-500">Electron</td>
						<td className="border border-gray-500">{versions.electron}</td>
					</tr>
					<tr>
						<td className="border border-gray-500">NodeJS</td>
						<td className="border border-gray-500">{versions.node}</td>
					</tr>
					<tr>
						<td className="border border-gray-500">Chrome</td>
						<td className="border border-gray-500">{versions.chrome}</td>
					</tr>
					<tr>
						<td className="border border-gray-500">{versions.os.name}</td>
						<td className="border border-gray-500">{versions.os.version}</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}

export default AppVersion
