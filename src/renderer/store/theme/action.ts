import { ThemeName, themes } from "./themes"
import { createAction } from "@reduxjs/toolkit"
import { setDefaultBackgroundColor } from "shared/ipc"

export const changeTheme = createAction("CHANGE_THEME", (payload: { name: ThemeName }) => {
	const { name } = payload
	localStorage.setItem("theme", name)
	setDefaultBackgroundColor.send(themes[name].background)
	document.body.style.color = themes[name].text.background
	document.body.style.backgroundColor = themes[name].background
	return { payload }
})

export default { changeTheme }
