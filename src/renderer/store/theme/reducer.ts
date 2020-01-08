import { Reducer } from "redux"
import { Theme, themes } from "./themes"
import { Action, CHANGE_THEME } from "./action"

interface ThemeStoreType extends Theme {
    name: keyof typeof themes
}

export type ThemeStore = Readonly<ThemeStoreType>

const init: ThemeStore = {
    name: "dark",
    ...themes.dark,
}

export const themeReducer: Reducer<ThemeStore, Action> = (state = init, action): ThemeStore => {
    switch (action.type) {
        case CHANGE_THEME:
            return { ...state, name: action.name, ...themes[action.name] }
        default:
            return state
    }
}
