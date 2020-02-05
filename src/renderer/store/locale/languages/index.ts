export interface Messages {
    hello: string
    test: string
}

const languageNames = {
    "en-US": "English",
    "zh-tw": "正體中文",
}

export type Locales = keyof typeof languageNames
