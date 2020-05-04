import { ThemeName } from "./themes"
export const CHANGE_THEME = "CHANGE_THEME"

interface ChangeThemeAction {
	type: typeof CHANGE_THEME
	name: ThemeName
}

export function changeTheme(name: ThemeName): ChangeThemeAction {
	return {
		type: CHANGE_THEME,
		name,
	}
}

const actionCreators = {
	changeTheme,
}

export default actionCreators

export type Action = ChangeThemeAction
