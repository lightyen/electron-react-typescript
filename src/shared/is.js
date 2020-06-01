export const isRenderer = () => typeof window === "object" && !!window?.document
export const isWorker = () => typeof self === "object" && self.constructor?.name === "DedicatedWorkerGlobalScope"
export const isMain = () => !(isRenderer() || isWorker())
