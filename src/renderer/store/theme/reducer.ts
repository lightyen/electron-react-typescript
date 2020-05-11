import { Theme, ThemeName, themes } from "./themes"
<<<<<<< HEAD
import { createReducer } from "@reduxjs/toolkit"
import { changeTheme } from "./action"
=======
import { Action } from "./action"
import { send } from "~/ipc"
>>>>>>> da5d1921b01e68b1a95fea2fdd3010f3e0c4c32e

export interface ThemeStore extends Theme {
	name: ThemeName
}

function getTheme(): Theme & { name: ThemeName } {
	switch (localStorage.getItem("theme")) {
		case "dark":
			return { name: "dark", ...themes.dark }
		default:
			return { name: "light", ...themes.light }
	}
}

const init: ThemeStore = {
	...getTheme(),
}

export const theme = createReducer(init, builder =>
	builder.addCase(changeTheme, (state, { payload: { name } }) => {
		return { ...state, name, ...themes[name] }
	}),
)
