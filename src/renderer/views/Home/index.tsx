import React from "react"
import Electron from "electron"
import { RouteComponentProps, Link } from "react-router-dom"
import { useSelector, useAction } from "~/store"
import ScrollBars from "~/components/ScrollBars"

import "./index.css"

const Home: React.FC<RouteComponentProps> = () => {
    const { textColor } = useSelector(state => state.theme)
    const logo = useSelector(state => state.app.logo)
    return (
        <ScrollBars>
            <div className="Home">
                <header className="Home-header">
                    {logo && <img src={`data:image/svg+xml;base64,${logo}`} className="Home-logo" alt="logo" />}
                    <p style={{ color: textColor }}>
                        Edit <code>src/renderer/views/Home/index.tsx</code> and save to reload.
                    </p>
                    <Link to="/version" className="btn btn-outline-secondary mb-3">
                        Version
                    </Link>
                    <a
                        className="Home-link"
                        href="https://reactjs.org"
                        onClick={e => {
                            e.preventDefault()
                            Electron.shell.openExternal("https://reactjs.org")
                        }}
                    >
                        Learn React
                    </a>
                </header>
            </div>
        </ScrollBars>
    )
}

export default Home
