import React from "react"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction } from "~/store"

import Page from "~/components/Page"
import DarkModeSwitch from "~/components/DarkModeSwitch"
import { openFolder } from "@shared/ipc"
import LocaleDropdown from "~/components/LocaleDropdown"
import styled from "@emotion/styled"

export default () => {
	return (
		<Page>
			<div className="mb-10">
				<label className="block font-bold mb-2" style={{ textTransform: "capitalize" }}>
					<FormattedMessage id="themes" />
				</label>
				<DarkModeSwitch />
			</div>
			<div className="mb-10">
				<label className="block font-bold mb-2" style={{ textTransform: "capitalize" }}>
					<FormattedMessage id="language" />
				</label>
				<LocaleDropdown />
			</div>
			<div className="mb-10">
				<label className="block font-bold mb-2" style={{ textTransform: "capitalize" }}>
					Paths
				</label>
				<AppPaths />
			</div>
		</Page>
	)
}

interface TableRowProps {
	odd: boolean
}

const TableRow = styled.tr<TableRowProps>`
	transition: background-color 0.2s ease;
	background-color: rgb(var(${({ odd }: TableRowProps) => (odd ? "--theme-secondary" : "--theme-secondaryvariant")}));
	:hover {
		background-color: rgb(var(--theme-hover-secondary));
	}
`

const AppPaths: React.FC = () => {
	const paths = useSelector(state => state.app.paths)
	const { getAppPaths } = useAction().app

	React.useEffect(() => {
		getAppPaths()
	}, [getAppPaths])

	return (
		<table className="table-auto">
			<thead>
				<tr>
					<th className="px-4 py-2">Key</th>
					<th className="px-4 py-2">Value</th>
				</tr>
			</thead>
			<tbody>
				{Object.keys(paths).map((k, i) => (
					<TableRow key={k} className="hover:bg-gray-100" odd={i % 2 == 1}>
						<td className="border px-4 py-2 border-gray-400">{k}</td>
						<td
							className="border px-4 py-2 border-gray-400 cursor-pointer"
							onClick={() => {
								openFolder.send(paths[k])
							}}
						>
							{paths[k]}
						</td>
					</TableRow>
				))}
			</tbody>
		</table>
	)
}
