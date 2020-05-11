import { Plugin, Compiler } from "webpack"

export default class CustomPlugin implements Plugin {
	apply(compiler: Compiler) {
		compiler.hooks.emit.tapAsync("CustomPlugin", (compilation, callback) => {
			console.log("This is an example plugin!")

			// Manipulate the build using the plugin API provided by webpack
			// compilation.addModule(/* ... */)

			callback()
		})
	}
}
