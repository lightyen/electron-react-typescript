import { getDateLocale } from "./locale"
import { formatDistance } from "date-fns"
export default (date: number | Date, base: number | Date) => formatDistance(date, base, { locale: getDateLocale() })
