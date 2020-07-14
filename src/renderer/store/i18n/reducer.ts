import { getLocale, storeLocale } from "./languages"
import { createReducer } from "@reduxjs/toolkit"
import { setLocale } from "./action"

interface I18nStoreType {
	locale: string
}

export type I18nStore = Readonly<I18nStoreType>

const init: I18nStore = {
	locale: getLocale(),
}

window.__locale__ = getLocale()

export const i18n = createReducer(init, builder =>
	builder.addCase(setLocale, (state, { payload: { locale, cached = false } }) => {
		if (cached) {
			storeLocale(locale)
		}
		window.__locale__ = locale
		state.locale = locale
	}),
)
