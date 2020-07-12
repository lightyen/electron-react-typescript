import React from "react"

import {
	Route as _Route,
	Redirect as _Redirect,
	Switch as _Switch,
	RouteProps,
	RedirectProps,
	SwitchProps,
} from "react-router-dom"

import ScrollBar from "~/components/ScrollBar"
import { motion, Variants } from "framer-motion"

export const pageVariants: Variants = {
	initial: {
		opacity: 0,
	},
	in: {
		x: 0,
		opacity: 1,
	},
	out: {
		opacity: 0,
	},
}

interface ExtraProps {
	custom?: Variants
}

export const Switch: React.FC<SwitchProps> = ({ children, ...props }) => {
	return <_Switch {...props}>{children}</_Switch>
}

export const Route: React.FC<RouteProps & ExtraProps> = ({ children, custom, ...props }) => {
	return (
		<_Route {...props}>
			<motion.div
				initial="initial"
				className="flex-grow"
				animate="in"
				exit="out"
				variants={custom || pageVariants}
			>
				<ScrollBar>{children}</ScrollBar>
			</motion.div>
		</_Route>
	)
}

export const Redirect: React.FC<RedirectProps> = ({ children, ...props }) => (
	<motion.div exit="undefined">
		<_Redirect {...props} />
	</motion.div>
)
