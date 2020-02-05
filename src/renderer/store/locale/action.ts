import { Locales, Messages } from "./languages"
import zhTW from "./languages/zh-tw"
export const SET_LOCALE = "SET_LOCALE"

export interface SetLocaleAction {
    type: typeof SET_LOCALE
    messages: Messages
}

const setLocale = (name: Locales): SetLocaleAction => {
    return {
        type: SET_LOCALE,
        messages: zhTW,
    }
}

const actionCreators = {
    setLocale,
}

export default actionCreators

export type Action = SetLocaleAction
