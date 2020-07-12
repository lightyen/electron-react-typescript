import React from "react"
import Select from "react-select"
import { useAction, useI18n } from "~/store"
import { supports } from "~/store/i18n/languages"

interface OptionType {
	label: string
	value: string
}

export default () => {
	const { setLocale } = useAction().i18n
	const { locale } = useI18n()
	const langOpts = Object.entries(supports).map<OptionType>(([value, label]) => ({ value, label }))
	return (
		<div className="w-64">
			<Select<OptionType>
				className="text-blue-500"
				options={langOpts}
				value={langOpts.find(v => v.value == locale)}
				onChange={v => setLocale({ locale: v["value"], cached: true })}
				isSearchable={false}
			/>
		</div>
	)
}
