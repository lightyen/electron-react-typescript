import React from "react"

import { useSelector, useAction } from "~/store"

export default function SwitchThemes() {
    const name = useSelector(state => state.theme.name)
    const { changeTheme } = useAction().theme

    return (
        <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
                name === "light" ? changeTheme("dark") : changeTheme("light")
            }}
        >
            Toggle Themes
        </button>
    )
}
