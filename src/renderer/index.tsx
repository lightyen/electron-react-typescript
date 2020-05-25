import React from "react"
import { render } from "react-dom"
import App from "./App"
render(<App />, document.getElementById("root"))

// https://github.com/andywer/threads-plugin/issues/10
import MyWorker from "./test.worker.ts"
const worker = new MyWorker("")
console.log(typeof MyWorker)
worker.onmessage = function (e) {
	console.log(e.data)
}
worker.postMessage([3, 7])
