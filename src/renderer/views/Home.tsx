import React from "react"
import { motion } from "framer-motion"
import { FormattedMessage } from "react-intl"
import "./Home.css"

import logo from "assets/images/logo.svg"
import Page from "~/components/Page"

import { css } from "styled-components"
import tw from "twin.macro"
const styles = css`
	${tw`select-text`}
`

// To prevent TypeScript errors on the css prop on arbitrary elements
import {} from "styled-components/cssprop"

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
					<span css={styles}>
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
