import React from "react"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction, useTheme } from "~/store"

import Page from "~/components/Page"
import DarkModeToggle from "~/components/DarkModeToggle"
import styled from "styled-components"
import { openFolder } from "@shared/ipc"
import LocaleSelect from "~/components/LocaleSelect"

export default () => {
	return (
		<Page>
			<div className="mb-10">
				<label className="block font-bold mb-2" style={{ textTransform: "capitalize" }}>
					<FormattedMessage id="themes" />
				</label>
				<DarkModeToggle />
			</div>
			<div className="mb-10">
				<label className="block font-bold mb-2" style={{ textTransform: "capitalize" }}>
					<FormattedMessage id="language" />
				</label>
				<LocaleSelect />
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
	color: string
	hoverColor: string
}

const TableRow = styled.tr.attrs(props => props)<TableRowProps>`
	transition: background-color 0.2s ease;
	background-color: ${props => props.color};
	:hover {
		background-color: ${props => props.hoverColor};
	}
`

const AppPaths: React.FC = () => {
	const {
		secondary: oddColor,
		secondaryVariant: evenColor,
		hover: { secondary: hoverColor },
	} = useTheme()
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
					<TableRow
						key={k}
						className="hover:bg-gray-100"
						color={i % 2 ? oddColor : evenColor}
						hoverColor={hoverColor}
					>
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
