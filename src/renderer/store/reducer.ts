import { combineReducers } from "redux"

import { AppStore, app } from "./app/reducer"
import { ThemeStore, theme } from "./theme/reducer"
import { I18nStore, i18n } from "./i18n/reducer"

export interface RootStore {
    app: AppStore
    theme: ThemeStore
    i18n: I18nStore
}

export const rootReducer = combineReducers({
    app,
    theme,
    i18n,
})
