import { createAction } from "@reduxjs/toolkit"
import { Locale, getLocaleMessages, setLocale as _setLocale } from "./languages"

export const setLocale = createAction("SET_LOCALE", ({ locale }: { locale: Locale }) => {
	_setLocale(locale)
	return {
		payload: {
			locale,
			messages: getLocaleMessages(),
		},
	}
})

export default { setLocale }
