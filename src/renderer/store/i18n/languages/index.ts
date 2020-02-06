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

const enUS = () => import("./en-us")
const zhTW = () => import("./zh-tw")

/** 取得在地化語言字典 */
export function getLocaleByName(name: string): Promise<Module<Messages>> {
    const [language, region] = name.toLocaleLowerCase().split(/-/)
    switch (language) {
        case "en":
            return enUS()
        case "zh":
            switch (region) {
                case "tw":
                    return zhTW()
                default:
                    return zhTW()
            }
        default:
            return enUS()
    }
}
