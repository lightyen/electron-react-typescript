import React from "react"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction, useI18n } from "~/store/hooks"

import Page from "~/components/Page"
import DarkModeSwitch from "~/components/DarkModeSwitch"
import { openFolder } from "@shared/ipc"
import LocaleDropdown from "~/components/LocaleDropdown"
import styled from "@emotion/styled"
import tw from "twin.macro"

const Field = styled.div`
	${tw`mb-10`}
	> label {
		${tw`block font-bold mb-2 capitalize`}
	}
`

export default () => {
	const { enable } = useI18n()
	return (
		<Page>
			<Field>
				<label>
					<FormattedMessage id="themes" />
				</label>
				<DarkModeSwitch />
			</Field>
			{enable && (
				<Field>
					<label>
						<FormattedMessage id="language" />
					</label>
					<LocaleDropdown />
				</Field>
			)}
			<Field>
				<label>Paths</label>
				<AppPaths />
			</Field>
		</Page>
	)
}

const Th = tw.th`px-4 py-2`

const Td = tw.td`border px-4 py-2 border-gray-400`

interface TableRowProps {
	odd: boolean
}

const TableRow = styled.tr<TableRowProps>`
	${tw`cursor-pointer`}
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
		<table tw="table-auto">
			<thead>
				<tr>
					<Th>Key</Th>
					<Th>Value</Th>
				</tr>
			</thead>
			<tbody>
				{Object.keys(paths).map((k, i) => (
					<TableRow
						key={k}
						odd={i % 2 == 1}
						onClick={() => {
							openFolder.send(paths[k])
						}}
					>
						<Td>{k}</Td>
						<Td>{paths[k]}</Td>
					</TableRow>
				))}
			</tbody>
		</table>
	)
}
