/** This Web Workers API interface represents a background task that can be easily created and can send messages back to its creator. Creating a worker is as simple as calling the Worker() constructor to be run in the worker thread. */
export interface WebWorker {
	prototype: Worker
	/** This Web Workers API interface represents a background task that can be easily created and can send messages back to its creator. Creating a worker is as simple as calling the Worker() constructor to be run in the worker thread. */
	new (): Worker
}

declare module "*.worker.ts" {
	declare const worker: WebWorker
	export default worker
}
