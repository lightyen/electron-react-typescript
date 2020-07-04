import { getLocale, languageNames } from "./languages"
import { createReducer } from "@reduxjs/toolkit"
import { setLocale } from "./action"

interface I18nStoreType {
	enable: boolean
	locale: string
	support: { [key: string]: string }
}

export type I18nStore = Readonly<I18nStoreType>

const init: I18nStore = {
	enable: true,
	locale: getLocale(),
	support: languageNames,
}

export const i18n = createReducer(init, builder =>
	builder.addCase(setLocale, (state, { payload }) => ({ ...state, ...payload })),
)
