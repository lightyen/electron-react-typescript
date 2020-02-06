export interface Messages {
    language: string
    hello: string
    test: string
}

const languageNames = {
    "en-US": "English",
    "zh-TW": "正體中文",
}

export type Locales = keyof typeof languageNames

export interface Module<T> {
    __esModule?: boolean
    default?: T
}

// NOTE: https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers

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

export function getLanguage(): Locales {
    const result = localStorage.getItem("language")
    if (result) {
        return result as Locales
    }
    return "zh-TW"
}

export function setLanguage(name: Locales) {
    localStorage.setItem("language", name)
}

import enUS from "./en-us"
import zhTW from "./zh-tw"

export function getLocaleMessages(name: Locales = "zh-TW") {
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
