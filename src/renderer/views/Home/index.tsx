import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useSelector } from "~/store"
import { FormattedMessage } from "react-intl"

import "./index.css"

import logo from "assets/images/logo.svg"

const Home: React.FC = () => {
	const { textColor } = useSelector(state => state.theme)
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
				<a className="Home-link" href="https://reactjs.org" rel="noopener noreferrer">
					Learn React
				</a>
				<Link to="/version">
					<button className="btn btn-blue my-2">Version</button>
				</Link>
			</header>
		</div>
	)
}

export default Home
