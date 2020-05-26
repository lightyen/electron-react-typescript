import { subscribe, unsubscribe, SubscribeCallBack } from "~/ipc"
import { eventChannel, END } from "redux-saga"
import { fork, call } from "redux-saga/effects"
import app from "./app/saga"

export function* ipcChannel(channel: string) {
	return yield call(() =>
		eventChannel(emitter => {
			const callback: SubscribeCallBack = (_, res) => {
				if (Object.prototype.hasOwnProperty.call(res, "error")) {
					emitter(res.error)
					emitter(END)
					return
				}
				if (Object.prototype.hasOwnProperty.call(res, "data")) {
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
}

export default rootSaga
