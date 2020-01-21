import React from "react"
import Electron from "electron"
import { RouteComponentProps, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useSelector } from "~/store"
import { tailwindcssconfig } from "~/tailwind.config"

import "./index.css"

import logo from "~assets/images/logo.svg"

const Home: React.FC<RouteComponentProps> = () => {
    const { textColor, name } = useSelector(state => state.theme)
    const colors = tailwindcssconfig.theme.colors
    return (
        <div className="Home">
            <header className="Home-header">
                <motion.img
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, loop: Infinity }}
                    src={logo}
                    className="Home-logo"
                    alt="logo"
                />
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
                        variants={{
                            hover: {
                                backgroundColor: name === "light" ? colors.blue[700] : colors.blue[400],
                                transition: { duration: 0.2 },
                            },
                        }}
                    >
                        Version
                    </motion.div>
                </Link>
            </header>
        </div>
    )
}

export default Home
