import { Reducer } from "redux"
import { Locales, Messages } from "./languages"
import { Action } from "./action"
import zhTW from "./languages/zh-tw"

interface LocaleStoreType {
    name: Locales
    messages?: Messages
}

export type LocaleStore = Readonly<LocaleStoreType>

function getCurrentLanguage(): Locales {
    const result = localStorage.getItem("locale")
    if (result) {
        return result.toLowerCase() as Locales
    }
    return "zh-tw"
}

const init: LocaleStore = {
    name: getCurrentLanguage(),
    messages: zhTW,
}

export const locale: Reducer<LocaleStore, Action> = (state = init, action): LocaleStore => {
    switch (action.type) {
        default:
            return state
    }
}
