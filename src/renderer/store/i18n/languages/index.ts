export * from "./messages"
import { setDateLocale } from "~/date"

// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const languageNames = {
	"en-US": "English",
	"zh-TW": "正體中文",
}

export const defaultLocale = "en-US"

export type Locale = keyof typeof languageNames

export function setLocale(locale: Locale) {
	localStorage.setItem("locale", locale)
	setDateLocale(locale)
}

export function getLocale(): Locale {
	const result = localStorage.getItem("locale")
	if (result) {
		return result as Locale
	}
	setLocale(defaultLocale)
	return defaultLocale
}

import enUS from "./en-US"
import zhTW from "./zh-TW"

export function getLocaleMessages() {
	const locale = getLocale()
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			return enUS
		case "zh":
			return zhTW
		default:
			return enUS
	}
}
