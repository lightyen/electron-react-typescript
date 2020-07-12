import { getDateLocale } from "./locale"
import { format } from "date-fns"
export default (date: number | Date, formatStr: string) => format(date, formatStr, { locale: getDateLocale() })
