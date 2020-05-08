import { Reducer } from "redux"
import { Locales, Messages, getLanguage, getLocaleMessages, languageNames } from "./languages"
import { Action } from "./action"

interface I18nStoreType {
	enable: boolean
	name: Locales
	messages: Messages
	support: { [key: string]: string }
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
		case "SET_LOCALE":
			return { ...state, name: action.name, messages: action.messages }
		default:
			return state
	}
}
