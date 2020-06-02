import { fork } from "redux-saga/effects"
import app from "./app/saga"

function* rootSaga() {
	yield fork(app)
}

export default rootSaga
