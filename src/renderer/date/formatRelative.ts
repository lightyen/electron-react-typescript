import { getDateLocale } from "./locale"
import { formatRelative } from "date-fns"
export default (date: number | Date, base: number | Date) => formatRelative(date, base, { locale: getDateLocale() })
