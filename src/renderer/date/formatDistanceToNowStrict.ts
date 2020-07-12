import { getDateLocale } from "./locale"
import { formatDistanceToNowStrict } from "date-fns"
export default (date: number | Date) => formatDistanceToNowStrict(date, { locale: getDateLocale() })
