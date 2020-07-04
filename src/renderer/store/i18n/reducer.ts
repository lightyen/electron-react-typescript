import { getLocale } from "./languages"
import { createReducer } from "@reduxjs/toolkit"
import { setLocale } from "./action"

interface I18nStoreType {
	locale: string
}

export type I18nStore = Readonly<I18nStoreType>

const init: I18nStore = {
	locale: getLocale(),
}

export const i18n = createReducer(init, builder =>
	builder.addCase(setLocale, (state, { payload }) => ({ ...state, ...payload })),
)
