import React from "react"
import { RouteComponentProps, Link } from "react-router-dom"
import AppVersion from "~/components/AppVersion"
import SwitchThemes from "~/components/SwitchThemes"
import ScrollBars from "~/components/ScrollBars"

import { request } from "~/ipc"

const Main: React.FC<RouteComponentProps> = ({}) => {
    const [text, setText] = React.useState("")
    return (
        <ScrollBars>
            <div className="container-fluid">
                <div className="row">
                    <div className="col">
                        <AppVersion />
                    </div>
                </div>
                <div className="row">
                    <div className="col-auto">
                        <SwitchThemes />
                        <button
                            className="btn btn-primary"
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
                        {text && <div className="text-secondary">{text}</div>}
                        <div>
                            <Link to="/">Home</Link>
                        </div>
                        <div className="bg-light" style={{ height: 3000 }}></div>
                    </div>
                </div>
            </div>
        </ScrollBars>
    )
}

export default Main
