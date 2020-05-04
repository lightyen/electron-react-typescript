import { Reducer } from "redux"
import { Locales, Messages, getLanguage, getLocaleMessages, languageNames } from "./languages"
import { Action, SET_LOCALE } from "./action"

interface I18nStoreType {
	enable: boolean
	name: Locales
	messages: Messages
	support: { [key: string]: string }
	status?: SET_LOCALE
}

export type I18nStore = Readonly<I18nStoreType>

const init: I18nStore = {
	enable: true,
	name: getLanguage(),
	messages: getLocaleMessages(getLanguage()),
	support: languageNames,
}

export const i18n: Reducer<I18nStore, Action> = (state = init, action): I18nStore => {
	switch (action.type) {
		case SET_LOCALE.SUCCESS:
			return { ...state, name: action.name, messages: action.messages, status: SET_LOCALE.SUCCESS }
		default:
			return state
	}
}
