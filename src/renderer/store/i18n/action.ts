import { createAction } from "@reduxjs/toolkit"

export const setLocale = createAction("SET_LOCALE", (payload: { locale: string; cached?: boolean }) => {
	const [primary] = payload.locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			payload.locale = "en-US"
			break
		case "zh":
			payload.locale = "zh-TW"
			break
		default:
			console.warn(`"${payload.locale} is not found, select "en-US"`)
			payload.locale = "en-US"
			break
	}
	return { payload }
})

export default { setLocale }
