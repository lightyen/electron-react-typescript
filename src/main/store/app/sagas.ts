import { fork, put } from "redux-saga/effects"
import os from "os"
import { appVersion } from "~/const"
import { GetVersionsAction, GET_VERSIONS } from "./action"

function* worker() {
	yield put<GetVersionsAction>({
		type: GET_VERSIONS,
		versions: { ...process.versions, app: appVersion, os: { name: os.platform(), version: os.release() } },
	})
}

export default function* sagas() {
	yield fork(worker)
}
