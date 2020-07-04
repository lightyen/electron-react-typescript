import { setDateLocale } from "./date"

// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const languageNames = {
	"en-US": "English",
	"zh-TW": "正體中文",
}

export const defaultLocale = "en-US"

export function setLocale(locale: string) {
	if (Object.keys(languageNames).some(loc => loc === locale)) {
		localStorage.setItem("locale", locale)
		setDateLocale(locale)
	} else {
		throw new Error(`"${locale}" resource is not found.`)
	}
}

export function getLocale() {
	const result = localStorage.getItem("locale")
	if (result) {
		return result
	}
	return defaultLocale
}

import enUS from "./locales/en-US.yml"
import zhTW from "./locales/zh-TW.yml"

export function getLocaleMessages(locale: string) {
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
