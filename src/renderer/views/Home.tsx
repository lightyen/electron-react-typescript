import React from "react"
import { motion } from "framer-motion"
import { FormattedMessage } from "react-intl"

import "./Home.css"

import logo from "assets/images/logo.svg"
import Page from "~/components/Page"

export default () => {
	return (
		<Page>
			<div className="Home select-none">
				<header className="Home-header">
					<img src={logo} className="Home-logo" alt="logo" />
					<p className="select-text">
						Edit{" "}
						<motion.code whileHover={{ color: "#02dddd" }} className="text-indigo-500 hover:underline">
							renderer/views/Home/index.tsx
						</motion.code>{" "}
						and save to reload.
					</p>
					<span className="select-text">
						<FormattedMessage id="test" values={{ name: "React" }} />
					</span>
					<a className="Home-link" href="https://reactjs.org" rel="noopener noreferrer">
						Learn React
					</a>
				</header>
			</div>
		</Page>
	)
}
