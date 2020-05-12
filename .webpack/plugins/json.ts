export function json_minify(json: string) {
	const tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g
	let in_string = false
	let in_multiline_comment = false
	let in_singleline_comment = false
	let tmp
	let tmp2
	let new_str = []
	let ns = 0
	let from = 0
	let lc
	let rc

	tokenizer.lastIndex = 0

	while ((tmp = tokenizer.exec(json))) {
		lc = RegExp["leftContext"]
		rc = RegExp["rightContext"]
		if (!in_multiline_comment && !in_singleline_comment) {
			tmp2 = lc.substring(from)
			if (!in_string) {
				tmp2 = tmp2.replace(/(\n|\r|\s)*/g, "")
			}
			new_str[ns++] = tmp2
		}
		from = tokenizer.lastIndex

		if (tmp[0] == '"' && !in_multiline_comment && !in_singleline_comment) {
			tmp2 = lc.match(/(\\)*$/)
			if (!in_string || !tmp2 || tmp2[0].length % 2 == 0) {
				// start of string with ", or unescaped " character found to end string
				in_string = !in_string
			}
			from-- // include " character in next catch
			rc = json.substring(from)
		} else if (tmp[0] == "/*" && !in_string && !in_multiline_comment && !in_singleline_comment) {
			in_multiline_comment = true
		} else if (tmp[0] == "*/" && !in_string && in_multiline_comment && !in_singleline_comment) {
			in_multiline_comment = false
		} else if (tmp[0] == "//" && !in_string && !in_multiline_comment && !in_singleline_comment) {
			in_singleline_comment = true
		} else if ((tmp[0] == "\n" || tmp[0] == "\r") && !in_string && !in_multiline_comment && in_singleline_comment) {
			in_singleline_comment = false
		} else if (!in_multiline_comment && !in_singleline_comment && !/\n|\r|\s/.test(tmp[0])) {
			new_str[ns++] = tmp[0]
		}
	}
	new_str[ns++] = rc
	return new_str.join("")
}

export function json_parse(s: string) {
	try {
		return JSON.parse(s)
	} catch {
		return undefined
	}
}
