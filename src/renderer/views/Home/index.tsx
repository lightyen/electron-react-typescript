import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useSelector } from "~/store"
import { tailwindcssconfig } from "~/tailwind.config"
import { FormattedMessage } from "react-intl"

import "./index.css"

import logo from "~assets/images/logo.svg"

const Home: React.FC = () => {
    const { textColor, name } = useSelector(state => state.theme)
    const colors = tailwindcssconfig.theme.colors
    return (
        <div className="Home select-none">
            <header className="Home-header">
                <motion.img
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, loop: Infinity }}
                    src={logo}
                    className="Home-logo"
                    alt="logo"
                />
                <p className="select-text" style={{ color: textColor }}>
                    Edit <code className="text-indigo-500">renderer/views/Home/index.tsx</code> and save to reload.
                </p>
                <span className="select-text" style={{ color: textColor }}>
                    <FormattedMessage id="test" values={{ name: "React" }} />
                </span>
                <a
                    className="Home-link"
                    href="https://reactjs.org"
                    onClick={e => {
                        e.preventDefault()
                        window.electron.shell.openExternal("https://reactjs.org")
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
