export const isRenderer = () => !!globalThis.document
export const isWorker = () =>
	typeof globalThis.self === "object" && globalThis.self.constructor?.name === "DedicatedWorkerGlobalScope"
export const isMain = () => process.type === "browser"
