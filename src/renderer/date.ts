import dfFormat from "date-fns/fp/formatWithOptions"
import { getDateLocale } from "~/store/i18n/languages"
export const format = (date: Date, formatStr: string) => dfFormat({ locale: getDateLocale() })(formatStr)(date)
