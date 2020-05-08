import { Reducer } from "redux"
import { Theme, ThemeName, themes } from "./themes"
import { Action } from "./action"
import { send } from "~/ipc"

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

send("set.default.backgroundColor", themes[init.name].backgroundColor)

export const theme: Reducer<ThemeStore, Action> = (state = init, action): ThemeStore => {
	switch (action.type) {
		case "CHANGE_THEME":
			localStorage.setItem("theme", action.name)
			send("set.default.backgroundColor", themes[action.name].backgroundColor)
			return { ...state, name: action.name, ...themes[action.name] }
		default:
			return state
	}
}
