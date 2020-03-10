import { fork } from "redux-saga/effects"

import app from "./app/sagas"

export default function* root() {
    yield fork(app)
}
