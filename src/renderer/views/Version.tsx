import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import AppVersion from "~/components/AppVersion"
import SwitchThemes from "~/components/SwitchThemes"

import { request } from "~/ipc"

const Main: React.FC<RouteComponentProps> = ({}) => {
    const [text, setText] = React.useState("")
    return (
        <div className="mx-3 my-2">
            <AppVersion />
            <SwitchThemes />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-bg"
                onClick={() => {
                    request<{
                        canceled: boolean
                        filePaths: string[]
                        files: string[]
                    }>("app.dialog.open").then(data => {
                        const { canceled, filePaths } = data
                        if (!canceled) {
                            setText(filePaths[0])
                        }
                    })
                }}
            >
                Open Dialog
            </button>
            {text && <div className="text-gray">{text}</div>}
            <div className="bg-gray-500" style={{ width: 300, height: 2000 }}></div>
            <Link
                to="/"
                className="inline-block mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-bg"
            >
                Home
            </Link>
        </div>
    )
}

export default Main
