import React from "react"

import { Route, Redirect, RouteProps, RedirectProps } from "react-router-dom"

import ScrollBar from "~/components/ScrollBar"
import { motion, Variants } from "framer-motion"
import "twin.macro"

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

export const MotionRoute: React.FC<RouteProps & { variants?: Variants }> = ({ children, variants, ...props }) => {
	return (
		<Route {...props}>
			<motion.div tw="flex-grow" initial="initial" animate="in" exit="out" variants={variants || pageVariants}>
				<ScrollBar>{children}</ScrollBar>
			</motion.div>
		</Route>
	)
}

export const MotionRedirect: React.FC<RedirectProps> = ({ ...props }) => (
	<motion.div exit="undefined">
		<Redirect {...props} />
	</motion.div>
)
