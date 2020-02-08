import React from "react"
import { FormattedMessage } from "react-intl"
import Select, { ValueType } from "react-select"
import { useSelector, useAction } from "~/store"
import { languageNames } from "~/store/i18n/languages"

import Back from "~/components/Back"

interface OptionType {
    label: string
    value: string
}

const Page: React.FC = () => {
    const textColor = useSelector(state => state.theme.textColor)

    const { setLocale } = useAction().i18n
    const name = useSelector(state => state.i18n.name)
    const langOpts = Object.entries(languageNames).map<OptionType>(([value, label]) => ({ value, label }))

    const { changeTheme } = useAction().theme
    const messages = useSelector(state => state.i18n.messages)
    const theme = useSelector(state => state.theme.name)
    const themeOpts: OptionType[] = [
        { value: "light", label: messages["themes.light"] },
        { value: "dark", label: messages["themes.dark"] },
    ]
    return (
        <div>
            <Back to="/version" />
            <div className="pt-3 pl-3">
                <div className="mb-10">
                    <label className="block font-bold mb-2" style={{ color: textColor, textTransform: "capitalize" }}>
                        <FormattedMessage id="language" />
                    </label>
                    <div className="w-64">
                        <Select<OptionType>
                            className="text-blue-500"
                            options={langOpts}
                            value={langOpts.find(v => v.value == name)}
                            onChange={v => setLocale(v["value"])}
                            isSearchable={false}
                        />
                    </div>
                </div>
                <div className="">
                    <label className="block font-bold mb-2" style={{ color: textColor, textTransform: "capitalize" }}>
                        <FormattedMessage id="themes" />
                    </label>
                    <div className="w-64">
                        <Select
                            className="text-blue-500"
                            options={themeOpts}
                            value={themeOpts.find(v => v.value == theme)}
                            onChange={v => changeTheme(v["value"])}
                            isSearchable={false}
                            styles={{
                                option: s => ({ ...s, textTransform: "capitalize" }),
                                container: s => ({ ...s, textTransform: "capitalize" }),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
