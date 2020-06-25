import React from "react"
import { FormattedMessage } from "react-intl"
import Select from "react-select"
import { useSelector, useAction } from "~/store"
import { languageNames } from "~/store/i18n/languages"

import Back from "~/components/Back"
import styled from "styled-components"
import { openFolder } from "shared/ipc"

interface OptionType {
	label: string
	value: string
}

const Page: React.FC = () => {
	const color = useSelector(state => state.theme.text.primary)

	const { setLocale } = useAction().i18n
	const locale = useSelector(state => state.i18n.locale)
	const langOpts = Object.entries(languageNames).map<OptionType>(([value, label]) => ({ value, label }))

	const { changeTheme } = useAction().theme
	const messages = useSelector(state => state.i18n.messages)
	const theme = useSelector(state => state.theme.name)
	const themeOpts: OptionType[] = [
		{ value: "light", label: messages["themes.light"] },
		{ value: "dark", label: messages["themes.dark"] },
	]

	return (
		<>
			<Back to="/version" />
			<div className="pt-3 pl-3">
				<div className="mb-10">
					<label className="block font-bold mb-2" style={{ color, textTransform: "capitalize" }}>
						<FormattedMessage id="themes" />
					</label>
					<div className="w-64">
						<Select
							className="text-blue-500"
							options={themeOpts}
							value={themeOpts.find(v => v.value == theme)}
							onChange={v => changeTheme({ name: v["value"] })}
							isSearchable={false}
							styles={{
								option: s => ({ ...s, textTransform: "capitalize" }),
								container: s => ({ ...s, textTransform: "capitalize" }),
							}}
						/>
					</div>
				</div>
				<div className="mb-10">
					<label className="block font-bold mb-2" style={{ color, textTransform: "capitalize" }}>
						<FormattedMessage id="language" />
					</label>
					<div className="w-64">
						<Select<OptionType>
							className="text-blue-500"
							options={langOpts}
							value={langOpts.find(v => v.value == locale)}
							onChange={v => setLocale({ locale: v["value"] })}
							isSearchable={false}
						/>
					</div>
				</div>
				<div className="mb-10">
					<label className="block font-bold mb-2" style={{ color, textTransform: "capitalize" }}>
						Paths
					</label>
					<AppPaths />
				</div>
			</div>
		</>
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
	const color = useSelector(state => state.theme.text.primary)
	const oddColor = useSelector(state => state.theme.primary)
	const evenColor = useSelector(state => state.theme.primaryVariant)
	const hoverColor = useSelector(state => state.theme.hover.primary)
	const paths = useSelector(state => state.app.paths)
	const { getAppPaths } = useAction().app

	React.useEffect(() => {
		getAppPaths()
	}, [getAppPaths])

	return (
		<table className="table-auto" style={{ color }}>
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

export default Page
