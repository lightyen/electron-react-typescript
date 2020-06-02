import dfFormat from "date-fns/fp/formatWithOptions"
import { enUS, zhTW } from "date-fns/locale"
import buildFormatLongFn from "date-fns/locale/_lib/buildFormatLongFn"

const locales = {
	"en-US": enUS,
	"zh-TW": zhTW,
}

const defaultLacole = "zh-TW"

const dateFormats_zh_TW = {
	full: "y'年'M'月'd'日' EEEE",
	long: "y'年'M'月'd'日'",
	medium: "yyyy-MM-dd",
	short: "y-MM-dd",
}
zhTW.formatLong.date = buildFormatLongFn({
	formats: dateFormats_zh_TW,
	defaultWidth: "full",
})

function getCurrentLanguage() {
	const result = localStorage.getItem("locale")
	if (result) {
		return result
	}
	return defaultLacole
}

export function getDateLocale() {
	return locales[window["__localeId__"]]
}

export function setDateLocale(locale: string) {
	window["__localeId__"] = locale
}

setDateLocale(getCurrentLanguage())

export const format = (date: Date, formatStr: string) =>
	dfFormat({
		locale: getDateLocale(),
	})(formatStr)(date)
