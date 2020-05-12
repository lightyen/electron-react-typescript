// From https://github.com/s-panferov/awesome-typescript-loader/blob/master/src/paths-plugin.ts

import { ResolvePlugin } from "webpack"
import { Hook } from "tapable"
import getInnerRequest from "enhanced-resolve/lib/getInnerRequest"
import { CompilerOptions } from "typescript"
import path from "path"
import fs from "fs"
import { json_minify, json_parse } from "./json"

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
	constructor({ configFile }: PluginOptions | undefined = {}) {
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

export default TsPathsResolvePlugin
module.exports = TsPathsResolvePlugin
