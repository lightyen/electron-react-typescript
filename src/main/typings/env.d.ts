declare namespace NodeJS {
	interface ProcessEnv {
		NODE_ENV: "development" | "production"
		ELECTRON_DISABLE_SECURITY_WARNINGS: boolean
	}
}
