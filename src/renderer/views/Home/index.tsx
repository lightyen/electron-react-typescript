import React from "react"
import Electron from "electron"
import { RouteComponentProps, Link } from "react-router-dom"
import { useSelector, useAction } from "~/store"

import "./index.css"

const Home: React.FC<RouteComponentProps> = () => {
    const { textColor } = useSelector(state => state.theme)
    const { getAppLogo } = useAction().app
    React.useEffect(() => {
        getAppLogo()
    }, [getAppLogo])
    const logo = useSelector(state => state.app.logo)
    return (
        <div className="Home">
            <header className="Home-header">
                {logo && <img src={`data:image/svg+xml;base64,${logo}`} className="Home-logo" alt="logo" />}
                <p style={{ color: textColor }}>
                    Edit <code className="text-indigo-500">renderer/views/Home/index.tsx</code> and save to reload.
                </p>
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
                <Link
                    to="/version"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 my-2 rounded transition-bg"
                >
                    Version
                </Link>
            </header>
        </div>
    )
}

export default Home
