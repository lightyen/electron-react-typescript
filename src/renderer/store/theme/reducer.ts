import { Theme, ThemeName, themes } from "./themes"
import { createReducer } from "@reduxjs/toolkit"
import { changeTheme } from "./action"
import { setDefaultBackgroundColor } from "~/../shared/ipc"

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
		const backgroundColor = themes[name].backgroundColor
		setDefaultBackgroundColor.send(backgroundColor)
		document.body.style.backgroundColor = backgroundColor
		return { ...state, name, ...themes[name] }
	}),
)
