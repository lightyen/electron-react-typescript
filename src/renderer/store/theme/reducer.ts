import { Reducer } from "redux"
import { Theme, ThemeName, themes } from "./themes"
import { Action, CHANGE_THEME } from "./action"

interface ThemeStoreType extends Theme {
    name: ThemeName
}

export type ThemeStore = Readonly<ThemeStoreType>

function getTheme(): Theme & { name: ThemeName } {
    switch (localStorage.getItem("theme")) {
        case "light":
            return { name: "light", ...themes.light }
        default:
            return { name: "dark", ...themes.dark }
    }
}

const init: ThemeStore = {
    ...getTheme(),
}

export const theme: Reducer<ThemeStore, Action> = (state = init, action): ThemeStore => {
    switch (action.type) {
        case CHANGE_THEME:
            localStorage.setItem("theme", action.name)
            return { ...state, name: action.name, ...themes[action.name] }
        default:
            return state
    }
}
