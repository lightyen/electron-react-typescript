import React from "react"
import { AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import { Switch, Route } from "~/MotionRouter"

import Home from "~/views/Home"
import Demo from "~/views/Demo"
import Settings from "~/views/Settings"
import Log from "~/views/Log"
import ReactDnD from "~/views/ReactDnD"

export const AppRouter: React.FC = () => {
	return (
		<AnimatePresence exitBeforeEnter>
			<AppSwitch />
		</AnimatePresence>
	)
}

function useExternalLink() {
	React.useEffect(() => {
		// Link to anchor with default browser
		const h = (event: MouseEvent) => {
			const element = event.target as HTMLElement
			if (element?.tagName === "A") {
				const e = element as HTMLAnchorElement
				const url = new URL(e.href)
				if (process.env.NODE_ENV === "development" && url.hostname === "localhost") {
					return
				}
				if (url.protocol === "file:") {
					return
				}
				event.preventDefault()
				window.electron.shell.openExternal(url.href)
			}
		}
		document.documentElement.addEventListener("click", h)
		return () => document.documentElement.removeEventListener("click", h)
	}, [])
}

const AppSwitch: React.FC = () => {
	const location = useLocation()
	useExternalLink()
	return (
		<Switch key={location.pathname}>
			<Route
				path="/"
				exact
				custom={{
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
			</Route>
			<Route path="/demo">
				<Demo />
			</Route>
			<Route path="/settings">
				<Settings />
			</Route>
			<Route path="/dnd">
				<ReactDnD />
			</Route>
			<Route path="/log">
				<Log />
			</Route>
		</Switch>
	)
}
