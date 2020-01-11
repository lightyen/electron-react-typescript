import React from "react"

import { useSelector, useAction } from "~/store"

export default function SwitchThemes() {
    const name = useSelector(state => state.theme.name)
    const { changeTheme } = useAction().theme

    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-bg"
            onClick={() => {
                name === "light" ? changeTheme("dark") : changeTheme("light")
            }}
        >
            Toggle Themes
        </button>
    )
}
