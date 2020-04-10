import { Action as AppAction } from "./app/action"
import { Action as I18nAction } from "./i18n/action"
import { Action as ThemeAction } from "./theme/action"

export type RootAction = AppAction | I18nAction | ThemeAction
