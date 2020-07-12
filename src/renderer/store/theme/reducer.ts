import { prepareTheme, Theme, ThemeMode } from "./themes"
import { createReducer } from "@reduxjs/toolkit"
import { changeTheme } from "./action"

export interface ThemeStore extends Theme {
	name: ThemeMode
}

export const theme = createReducer(prepareTheme(), builder =>
	builder.addCase(changeTheme, (state, { payload: { name, cached = false } }) => ({
		...state,
		...prepareTheme(name, cached),
	})),
)
