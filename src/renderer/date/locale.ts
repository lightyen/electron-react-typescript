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
	const locale = globalThis.__locale__
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
