export {}

declare global {
	namespace NodeJS {
		interface Global {
			/** custom global variable */
			abcde: number
		}
		interface ProcessEnv {
			NODE_ENV: "development" | "production"
		}
	}
}
