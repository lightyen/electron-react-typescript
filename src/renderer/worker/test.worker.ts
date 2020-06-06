/** This Web Workers API interface represents a background task that can be easily created and can send messages back to its creator. Creating a worker is as simple as calling the Worker() constructor to be run in the worker thread. */
export interface WebWorker {
	prototype: Worker
	/** This Web Workers API interface represents a background task that can be easily created and can send messages back to its creator. Creating a worker is as simple as calling the Worker() constructor to be run in the worker thread. */
	new (): Worker
}
export default {} as WebWorker

const webWorker = (self as unknown) as DedicatedWorkerGlobalScope
webWorker.onmessage = function (e) {
	console.log("Message received from main script")
	const workerResult = "Result: " + e.data[0] * e.data[1]
	console.log("Posting message back to main script")
	webWorker.postMessage(workerResult)
	webWorker.close()
}
