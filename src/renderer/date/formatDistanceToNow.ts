import { getDateLocale } from "./locale"
import { formatDistanceToNow } from "date-fns"
export default (date: number | Date) => formatDistanceToNow(date, { locale: getDateLocale() })
