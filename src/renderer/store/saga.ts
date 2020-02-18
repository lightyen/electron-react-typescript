import { subscribe, unsubscribe, IpcRendererEvent, IpcResponsePattern } from "~/ipc"
import { eventChannel, END } from "redux-saga"
import { fork, call } from "redux-saga/effects"
import app from "./app/saga"
import i18n from "./i18n/saga"

export function* subscribeChannel(channel: string) {
    return yield call(() =>
        eventChannel(emitter => {
            function callback(_: IpcRendererEvent, res: IpcResponsePattern) {
                if (res.error) {
                    emitter(res.error)
                    emitter(END)
                    return
                }
                if (res.data) {
                    emitter(res.data)
                    return
                }
                console.error("Unexpected main response format:", JSON.stringify(res))
            }
            subscribe(channel, callback)
            return () => unsubscribe(channel, callback)
        }),
    )
}

function* rootSaga() {
    yield fork(app)
    yield fork(i18n)
}

export default rootSaga
