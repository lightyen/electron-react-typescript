import { createAction } from "@reduxjs/toolkit"
import { setLocale as __setLocale } from "./languages"

export const setLocale = createAction("SET_LOCALE", ({ locale }: { locale: string }) => {
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			locale = "en-US"
			break
		case "zh":
			locale = "zh-TW"
			break
		default:
			console.warn(`"${locale} is not found, select "en-US"`)
			locale = "en-US"
			break
	}

	__setLocale(locale)
	return {
		payload: {
			locale,
		},
	}
})

export default { setLocale }
