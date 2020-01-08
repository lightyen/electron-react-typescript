import { themes } from "./themes"
export const CHANGE_THEME = "CHANGE_THEME"

interface ChangeThemeAction {
    type: typeof CHANGE_THEME
    name: keyof typeof themes
}

export function changeTheme(name: keyof typeof themes): ChangeThemeAction {
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
