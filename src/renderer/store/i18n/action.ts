import { Locales, Messages, getLocaleMessages } from "./languages"
import { setDateLocale } from "~/date"

export interface SetLocaleAction {
	type: "SET_LOCALE"
	name: Locales
	messages: Messages
}

export const setLocale = (name: Locales): SetLocaleAction => {
	localStorage.setItem("language", name)
	setDateLocale(name)
	const messages = getLocaleMessages(name)
	return {
		type: "SET_LOCALE",
		name,
		messages,
	}
}

const actionCreators = {
	setLocale,
}

export default actionCreators

export type Action = SetLocaleAction
