import React from "react"
import Electron from "electron"
import { RouteComponentProps, Link } from "react-router-dom"
import { motion, Variants } from "framer-motion"
import { useSelector, useAction } from "~/store"

import "./index.css"

import cfg from "~/tailwind.config.js"

const buttonVariants: Variants = {
    hover: {
        backgroundColor: cfg.theme.colors.blue[400],
        transition: { duration: 0.3 },
    },
}

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
                {logo && (
                    <motion.img
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, loop: Infinity }}
                        src={`data:image/svg+xml;base64,${logo}`}
                        className="Home-logo"
                        alt="logo"
                    />
                )}
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
                <Link to="/version">
                    <motion.div
                        className="btn btn-blue my-2 select-none"
                        whileHover={"hover"}
                        variants={buttonVariants}
                    >
                        Version
                    </motion.div>
                </Link>
            </header>
        </div>
    )
}

export default Home
