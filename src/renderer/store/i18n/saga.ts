import { put, call, takeEvery } from "redux-saga/effects"
import { getLocaleMessages, Locales } from "./languages"
import { setDateLocale } from "~/date"

import { SET_LOCALE } from "./action"
import { SetLocaleAction, SagaSetLocaleAction } from "./action"

function* setLocale(action: SetLocaleAction) {
	const name = action.name as Locales
	localStorage.setItem("language", action.name)
	try {
		setDateLocale(name)
		const messages = yield call(getLocaleMessages, name)
		yield put<SagaSetLocaleAction>({ type: SET_LOCALE.SUCCESS, name, messages })
	} catch (error) {
		yield put<SagaSetLocaleAction>({ type: SET_LOCALE.FAILURE, error })
	}
}

export default function* saga() {
	yield takeEvery(SET_LOCALE.REQUEST, setLocale)
}
