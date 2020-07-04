// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const supports = {
	"en-US": "English",
	"zh-TW": "正體中文",
}

export const defaultLocale = "en-US"

export function setLocale(locale: string) {
	if (Object.keys(supports).some(loc => loc === locale)) {
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
		case "en":
			return $enUS
		case "zh":
			return $zhTW
		default:
			return $enUS
	}
}

// date-fns

import { enUS, zhTW } from "date-fns/locale"
import buildFormatLongFn from "date-fns/locale/_lib/buildFormatLongFn"

zhTW.formatLong.date = buildFormatLongFn({
	formats: {
		full: "y'年'M'月'd'日' EEEE",
		long: "y'年'M'月'd'日'",
		medium: "yyyy-MM-dd",
		short: "y-MM-dd",
	},
	defaultWidth: "full",
})

export function getDateLocale() {
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
