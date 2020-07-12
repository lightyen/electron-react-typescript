import { ThemeMode } from "./themes"
import { createAction } from "@reduxjs/toolkit"

export const changeTheme = createAction("CHANGE_THEME", (payload: { name: ThemeMode; cached?: boolean }) => {
	return { payload }
})

export default { changeTheme }
