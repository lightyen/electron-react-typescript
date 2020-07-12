import React from "react"
import { useAction, useI18n } from "~/store"
import { supports } from "~/store/i18n/languages"

interface OptionType {
	label: string
	value: string
}

export default () => {
	const { setLocale } = useAction().i18n
	const { locale } = useI18n()
	return (
		<select
			className="locale-select"
			value={locale}
			onChange={e => setLocale({ locale: e.target.value, cached: true })}
		>
			{Object.entries(supports).map(([k, v]) => (
				<option key={k} value={k}>
					{v}
				</option>
			))}
		</select>
	)
}
