import { put, call, takeEvery } from "redux-saga/effects"
import { Messages, Module, getLocaleByName } from "./languages"

import { SET_LOCALE } from "./action"
import { SetLocaleAction, SagaSetLocaleAction } from "./action"
import { setDateLocale } from "~/date"

function* setLocale(action: SetLocaleAction) {
    const { name } = action
    localStorage.setItem("language", action.name)
    try {
        // date-fns
        setDateLocale(name)
        const modu: Module<Messages> = yield call(getLocaleByName, name)
        if (modu) {
            const messages: Messages = modu.__esModule ? modu.default : (modu as Messages)

            yield put<SagaSetLocaleAction>({ type: SET_LOCALE.SUCCESS, name, messages })
        } else {
            yield put<SagaSetLocaleAction>({ type: SET_LOCALE.FAILURE, error: `module ${name} is not found` })
        }
    } catch (error) {
        yield put<SagaSetLocaleAction>({ type: SET_LOCALE.FAILURE, error })
    }
}

export default function* saga() {
    yield takeEvery(SET_LOCALE.REQUEST, setLocale)
}
