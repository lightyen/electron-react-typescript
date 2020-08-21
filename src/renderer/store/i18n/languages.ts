// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers

export type LocaleType = "en-US" | "zh-TW"

export const supports: Array<[LocaleType, string]> = [
	["en-US", "English"],
	["zh-TW", "正體中文"],
]

export const defaultLocale = window.navigator.language || "en-US"

export function storeLocale(locale: string) {
	if (supports.some(kv => kv[0] === locale)) {
		localStorage.setItem("locale", locale)
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

import $enUS from "./locales/en-US.yml"
import $zhTW from "./locales/zh-TW.yml"

export function getLocaleMessages(locale: string) {
	const [primary] = locale.toLocaleLowerCase().split(/-/)
	switch (primary) {
		case "zh":
			return $zhTW
		default:
			return $enUS
	}
}
