import { Locales, Messages, defaultLocale } from "./languages"

export enum SET_LOCALE {
    REQUEST = "SET_LOCALE_REQUEST",
    SUCCESS = "SET_LOCALE_SUCCESS",
    FAILURE = "SET_LOCALE_FAILURE",
}

export interface SetLocaleAction {
    type: SET_LOCALE.REQUEST
    name: string
}

export type SagaSetLocaleAction =
    | {
          type: SET_LOCALE.SUCCESS
          name: Locales
          messages: Messages
      }
    | {
          type: SET_LOCALE.FAILURE
          error: unknown
      }

export const setLocale = (name: string): SetLocaleAction => {
    return {
        type: SET_LOCALE.REQUEST,
        name: name || defaultLocale,
    }
}

const actionCreators = {
    setLocale,
}

export default actionCreators

export type Action = SetLocaleAction | SagaSetLocaleAction
