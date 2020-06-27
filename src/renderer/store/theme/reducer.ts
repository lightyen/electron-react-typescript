import { Theme, ThemeName, themes } from "./themes"
import { createReducer } from "@reduxjs/toolkit"
import { changeTheme } from "./action"
import chroma from "chroma-js"
import { setDefaultBackgroundColor } from "shared/ipc"

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

function initTheme(theme: Theme) {
	const root = document.documentElement
	const color = chroma(theme.primary)
	// const light = chroma.contrast(color, "white") < 2
	root.style.setProperty("--theme-btn-background", color.set("hsv.v", "0.5").css())
	root.style.setProperty("--theme-btn-background-hover", color.set("hsv.v", "0.7").css())
	root.style.setProperty("--theme-btn-focus-shadow", color.set("hsv.v", "0.5").alpha(0.7).css())
	document.body.style.color = theme.text.background
	document.body.style.backgroundColor = theme.background
	setDefaultBackgroundColor.send(theme.background)
}

const init: ThemeStore = {
	...getTheme(),
}
initTheme(getTheme())

export const theme = createReducer(init, builder =>
	builder.addCase(changeTheme, (state, { payload: { name } }) => {
		localStorage.setItem("theme", name)
		initTheme(themes[name])
		return { ...state, name, ...themes[name] }
	}),
)
