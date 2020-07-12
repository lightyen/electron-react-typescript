import { getDateLocale } from "./locale"
import { formatDistanceStrict } from "date-fns"
export default (date: number | Date, base: number | Date) =>
	formatDistanceStrict(date, base, { locale: getDateLocale() })
