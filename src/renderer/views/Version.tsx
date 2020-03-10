import React from "react"
import { Link, useHistory } from "react-router-dom"
import AppVersion from "./AppVersion"
import Back from "~/components/Back"

import { request } from "~/ipc"
import { useSelector } from "~/store"
import ScrollBar from "~/components/ScrollBar"

const Page: React.FC = ({}) => {
    const textColor = useSelector(state => state.theme.textColor)
    const [text, setText] = React.useState("")
    const history = useHistory()

    const ref = React.useRef<HTMLDivElement>()
    // React.useEffect(() => {
    //     ref.current.scrollTo({ top: 500, behavior: "smooth" })
    // }, [])

    return (
        <ScrollBar ref={ref}>
            <div className="select-none">
                <Back to="/" />
                <div className="mx-3 my-2">
                    <AppVersion />
                    <div className="mt-2">
                        <button
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => {
                                request<{
                                    filePaths: string[]
                                    files: string[]
                                }>("dialog.open").then(data => {
                                    const { filePaths } = data
                                    setText(filePaths[0])
                                })
                            }}
                        >
                            Open Dialog
                        </button>
                        <button
                            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => history.push("/settings")}
                        >
                            Settings
                        </button>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => history.push("/log")}
                        >
                            Log
                        </button>
                    </div>
                    {text && (
                        <div className="mt-2" style={{ color: textColor }}>
                            {text}
                        </div>
                    )}
                    <div className="mt-2 bg-gray-500" style={{ width: 300, height: 1300 }}></div>
                    <Link
                        to="/"
                        className="inline-block mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </ScrollBar>
    )
}

export default Page
