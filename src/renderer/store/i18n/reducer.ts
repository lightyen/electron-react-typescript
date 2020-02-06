import { Reducer } from "redux"
import { Locales, Messages } from "./languages"
import { Action, SET_LOCALE } from "./action"

interface I18nStoreType {
    enable: boolean
    name: Locales
    messages?: Messages
    status?: SET_LOCALE
}

export type I18nStore = Readonly<I18nStoreType>

function getCurrentLanguage(): Locales {
    const result = localStorage.getItem("language")
    if (result) {
        return result as Locales
    }
    return "zh-TW"
}

const init: I18nStore = {
    enable: true,
    name: getCurrentLanguage(),
}

export const i18n: Reducer<I18nStore, Action> = (state = init, action): I18nStore => {
    switch (action.type) {
        // set locale
        case SET_LOCALE.SUCCESS:
            return { ...state, messages: action.messages, status: SET_LOCALE.SUCCESS }
        default:
            return state
    }
}
