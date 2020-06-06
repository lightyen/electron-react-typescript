import React from "react"
import { render } from "react-dom"
import App from "./App"
render(<App />, document.getElementById("root"))

import MyWorker from "./worker/test.worker"
const worker = new MyWorker()

worker.onmessage = function (e) {
	console.log(e.data)
}
worker.postMessage([3, 7])
