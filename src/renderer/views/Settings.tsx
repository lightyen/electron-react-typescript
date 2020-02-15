import React from "react"
import { FormattedMessage } from "react-intl"
import Select from "react-select"
import { useSelector, useAction } from "~/store"
import { languageNames } from "~/store/i18n/languages"

import Back from "~/components/Back"
import { send } from "~/ipc"

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
                <div className="mb-10">
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
                <div className="mb-10">
                    <label className="block font-bold mb-2" style={{ color: textColor, textTransform: "capitalize" }}>
                        Paths
                    </label>
                    <AppPaths />
                </div>
            </div>
        </div>
    )
}

const AppPaths: React.FC = () => {
    const textColor = useSelector(state => state.theme.textColor)
    const color1 = useSelector(state => state.theme.primaryHoverColor)
    const color2 = useSelector(state => state.theme.primaryColor)
    const paths = useSelector(state => state.app.paths)
    const { getAppPaths } = useAction().app

    React.useEffect(() => {
        getAppPaths()
    }, [getAppPaths])

    const transition = "background-color 0.2s ease"

    return (
        <table className="table-auto" style={{ color: textColor }}>
            <thead>
                <tr>
                    <th className="px-4 py-2">Key</th>
                    <th className="px-4 py-2">Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.keys(paths).map((k, i) => (
                    <tr
                        key={k}
                        style={
                            i % 2 ? { backgroundColor: color1, transition } : { backgroundColor: color2, transition }
                        }
                    >
                        <td className="border px-4 py-2 border-gray-400">{k}</td>
                        <td
                            className="border px-4 py-2 border-gray-400"
                            onClick={() => {
                                send("show.folder", paths[k])
                            }}
                        >
                            {paths[k]}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Page
