import React from "react"
import { useHistory } from "react-router-dom"
import { FormattedMessage } from "react-intl"
import Select from "react-select"
import { useSelector, useAction } from "~/store"

const Page: React.FC = () => {
    const history = useHistory()
    const { setLocale } = useAction().i18n
    const textColor = useSelector(state => state.theme.textColor)
    const name = useSelector(state => state.i18n.name)
    const support = useSelector(state => state.i18n.support)
    const options = Object.entries(support).map(([value, label]) => ({ value, label }))
    return (
        <div>
            <button
                onClick={() => history.push("/version")}
                className="font-bold py-2 px-4 rounded focus:outline-none flex"
                style={{ color: textColor }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill={textColor}
                    className="mr-1"
                >
                    <path d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z" />
                </svg>
            </button>
            <div className="pt-3 pl-3">
                <label className="block font-bold mb-2" style={{ color: textColor }}>
                    <FormattedMessage id="language" />
                </label>
                <div className="w-64">
                    <Select
                        className="text-blue-500"
                        options={options}
                        value={options.find(v => v.value == name)}
                        onChange={e => setLocale(e["value"])}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
