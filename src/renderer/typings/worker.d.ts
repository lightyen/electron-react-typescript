import { WebWorker } from "./type"

declare module "*.worker.ts" {
	declare const worker: WebWorker
	export default worker
}
