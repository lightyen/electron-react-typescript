import { AnimatePresence } from "framer-motion"
import { useLocation, Switch } from "react-router-dom"
import { MotionRoute, MotionRedirect } from "~/components/MotionReactRouter"

import Home from "~/views/Home"
import Demo from "~/views/Demo"
import Settings from "~/views/Settings"
import Log from "~/views/Log"
import ReactDnD from "~/views/ReactDnD"

export const AppRouter = () => {
	return (
		<AnimatePresence exitBeforeEnter>
			<MyRoutes />
		</AnimatePresence>
	)
}

const MyRoutes = () => {
	const location = useLocation()
	return (
		<Switch key={location.pathname}>
			<MotionRoute
				path="/"
				exact
				variants={{
					initial: {
						x: 0,
						opacity: 0,
					},
					in: {
						x: 0,
						opacity: 1,
					},
					out: {
						opacity: 0,
						transition: { duration: 0.15 },
					},
				}}
			>
				<Home />
			</MotionRoute>
			<MotionRoute path="/demo">
				<Demo />
			</MotionRoute>
			<MotionRoute path="/settings">
				<Settings />
			</MotionRoute>
			<MotionRoute path="/dnd">
				<ReactDnD />
			</MotionRoute>
			<MotionRoute path="/log">
				<Log />
			</MotionRoute>
			<MotionRedirect to="/" />
		</Switch>
	)
}
