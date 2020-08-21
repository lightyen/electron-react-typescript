import { createAction } from "@reduxjs/toolkit"
import { LocaleType } from "./languages"

export const setLocale = createAction("SET_LOCALE", (payload: { locale: LocaleType; cached?: boolean }) => {
	return { payload }
})

export default { setLocale }
