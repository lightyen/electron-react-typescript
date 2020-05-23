import { setDateLocale } from "~/date"

// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const languageNames = {
	"en-US": "English",
	"zh-TW": "正體中文",
}

export const defaultLocale = "en-US"

export type Locale = keyof typeof languageNames

export function setLocale(locale: Locale): void {
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

import en from "./locales/en.yml"
import zh from "./locales/zh.yml"

export function getLocaleMessages() {
	const locale = getLocale()
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "en":
			return en
		case "zh":
			return zh
		default:
			return en
	}
}
