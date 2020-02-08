export * from "./messages"

// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers
export const languageNames = {
    "en-US": "English",
    "zh-TW": "正體中文",
}

export const defaultLocale = "en-US"

export type Locales = keyof typeof languageNames

export interface Module<T> {
    __esModule?: boolean
    default?: T
}

export function getLanguage(): Locales {
    const result = localStorage.getItem("language")
    if (result) {
        return result as Locales
    }
    localStorage.setItem("language", defaultLocale)
    return defaultLocale
}

export function setLanguage(name: Locales) {
    localStorage.setItem("language", name)
}

import enUS from "./en-us"
import zhTW from "./zh-tw"

export function getLocaleMessages(name: Locales = defaultLocale) {
    const [primary, region] = name.toLocaleLowerCase().split(/-/)
    switch (primary) {
        case "en":
            return enUS
        case "zh":
            switch (region) {
                default:
                    return zhTW
            }
        default:
            return enUS
    }
}

// const enUS = () => import("./en-us")
// const zhTW = () => import("./zh-tw")
/** async get locale messages */
// export function getLocaleMessages(name: string): Promise<Module<Messages>> {
//     const [language, region] = name.toLocaleLowerCase().split(/-/)
//     switch (language) {
//         case "en":
//             return enUS()
//         case "zh":
//             switch (region) {
//                 case "tw":
//                     return zhTW()
//                 default:
//                     return zhTW()
//             }
//         default:
//             return enUS()
//     }
// }
