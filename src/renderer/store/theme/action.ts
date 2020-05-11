import { ThemeName } from "./themes"
import { createAction } from "@reduxjs/toolkit"

export const changeTheme = createAction("CHANGE_THEME", (payload: { name: ThemeName }) => {
	localStorage.setItem("theme", payload.name)
	return { payload }
})

export default { changeTheme }
