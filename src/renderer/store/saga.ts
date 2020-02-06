import { fork } from "redux-saga/effects"
import app from "./app/saga"
import i18n from "./i18n/saga"

function* rootSaga() {
    yield fork(app)
    yield fork(i18n)
}

export default rootSaga
