import { ThemeName } from "./themes"
import { createAction } from "@reduxjs/toolkit"

export const changeTheme = createAction("CHANGE_THEME", (payload: { name: ThemeName }) => {
	return { payload }
})

export default { changeTheme }
