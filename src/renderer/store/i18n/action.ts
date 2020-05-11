import { createAction } from "@reduxjs/toolkit"
import { Locales, getLocaleMessages } from "./languages"
import { setDateLocale } from "~/date"

export const setLocale = createAction("SET_LOCALE", ({ name }: { name: Locales }) => {
	localStorage.setItem("language", name)
	setDateLocale(name)
	return {
		payload: {
			name,
			messages: getLocaleMessages(name),
		},
	}
})

export default { setLocale }
