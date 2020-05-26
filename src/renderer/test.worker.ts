export {}
const webWorker = (self as unknown) as DedicatedWorkerGlobalScope

webWorker.onmessage = function (e) {
	console.log("Message received from main script")
	const workerResult = "Result: " + e.data[0] * e.data[1]
	console.log("Posting message back to main script")
	webWorker.postMessage(workerResult)
	webWorker.close()
}
