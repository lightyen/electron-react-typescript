// From https://github.com/s-panferov/awesome-typescript-loader/blob/master/src/paths-plugin.ts

import { ResolvePlugin } from "webpack"
import { Hook } from "tapable"
import getInnerRequest from "enhanced-resolve/lib/getInnerRequest"
import { CompilerOptions } from "typescript"
import path from "path"
import fs from "fs"

interface Hooks {
	describedResolve: Hook
	// resolveStep: any
	// noResolve: any
	// resolve: any
	// result: any
	// parsedResolve: any
	// rawModule: any
	// module: any
	// relative: any
	// describedRelative: any
	// directory: any
	// existingDirectory: any
	// undescribedRawFile: any
	// rawFile: any
}

interface Request {
	request?: Request | string
	relativePath: string
}

interface ResolveContext {
	log: any
	stack: Set<string>
	missing: any
}

interface Resolver {
	hooks: Hooks
	doResolve(
		hook: Hook,
		request: Request,
		description: string,
		resolveContext: ResolveContext,
		Callback: Function,
	): void
	ensureHook(name: string): Hook
	join(relativePath: string, innerRequest: Request): Request
}

interface Mapping {
	onlyModule: boolean
	alias: string
	pattern: RegExp
	target: string
}

const escapeRegExp = (value: string) => value.replace(/[-\/\\^$*+?\.()[\]{}]/g, "\\$&")

interface PluginOptions {
	configFile?: string
}

/** resolve plugin for tsconfig paths */
class TsPathsResolvePlugin implements ResolvePlugin {
	configFilePath: string
	absoluteBaseUrl: string
	mappings: Mapping[]
	constructor({ configFile }: PluginOptions = {}) {
		const cwd = process.cwd()
		this.configFilePath = configFile ?? path.resolve(cwd, "tsconfig.json")
		this.absoluteBaseUrl = cwd
		this.mappings = this.createMappings()
	}

	private createMappings(): Mapping[] {
		let json_str = fs.readFileSync(this.configFilePath, { encoding: "utf-8" })
		json_str = json_minify(json_str)
		const config: { compilerOptions: CompilerOptions } = json_parse(json_str)
		if (!config) {
			return []
		}
		const { compilerOptions } = config
		if (!compilerOptions) {
			return []
		}
		const { baseUrl } = compilerOptions
		this.absoluteBaseUrl = path.resolve(path.dirname(this.configFilePath), baseUrl || ".")
		const paths = compilerOptions.paths ?? {}
		const mappings: Mapping[] = []
		for (const alias of Object.keys(paths)) {
			if (alias === "*") {
				throw new Error('TsPathsResolvePlugin: "*" alias path is not support.')
			}
			const onlyModule = alias.indexOf("*") === -1
			const excapedAlias = escapeRegExp(alias)
			const targets = paths[alias]
			for (const target of targets) {
				const pattern = onlyModule
					? new RegExp(`^${excapedAlias}$`)
					: new RegExp(`^${excapedAlias.replace("\\*", "(.*)")}`)
				mappings.push({ onlyModule, alias, pattern, target })
			}
		}
		return mappings
	}

	apply(resolver: Resolver) {
		for (const mapping of this.mappings) {
			// isTyping
			if (mapping.target.indexOf("@types") !== -1 || mapping.target.indexOf(".d.ts") !== -1) {
				continue
			}
			resolver.hooks.describedResolve.tapAsync(
				"ts-paths-resolvess-plugin",
				this.makeResolvePlugin(resolver, mapping),
			)
		}
	}

	private makeResolvePlugin(resolver: Resolver, { alias, pattern, target, onlyModule }: Mapping) {
		return (request: Request, context: ResolveContext, callback: Function) => {
			const innerRequest: string = getInnerRequest(resolver, request)
			if (!innerRequest) {
				return callback()
			}

			const [, relative] = innerRequest.match(pattern) ?? []
			if (!relative) {
				return callback()
			}

			let newRequestPath = target
			if (!onlyModule) {
				newRequestPath = newRequestPath.replace("*", relative)
			}
			newRequestPath = path.resolve(this.absoluteBaseUrl, newRequestPath)
			const newRequest = { ...request, request: newRequestPath }
			const hook = resolver.ensureHook("resolve")
			return resolver.doResolve(
				hook,
				newRequest,
				"aliased with mapping '" + innerRequest + "': '" + alias + "' to '" + newRequestPath + "'",
				context,
				callback,
			)
		}
	}
}

function json_minify(json: string) {
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

function json_parse(s: string) {
	try {
		return JSON.parse(s)
	} catch {
		return undefined
	}
}

export default TsPathsResolvePlugin
module.exports = TsPathsResolvePlugin
