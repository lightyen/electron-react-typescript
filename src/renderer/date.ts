import dfFormat from "date-fns/fp/formatWithOptions"
import { enUS, zhTW } from "date-fns/locale"

function getCurrentLanguage() {
    const result = localStorage.getItem("language")
    if (result) {
        return result
    }
    return "zh-TW"
}

export function setDateLocale(locale: string) {
    window["__localeId__"] = locale
}

const locales = {
    "en-US": enUS,
    "zh-TW": zhTW,
}

setDateLocale(getCurrentLanguage())

export const format = (date: Date, formatStr: string) =>
    dfFormat({
        locale: locales[window["__localeId__"]],
    })(formatStr)(date)
