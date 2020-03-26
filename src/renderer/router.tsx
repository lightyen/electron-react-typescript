import React from "react"
import { AnimatePresence } from "framer-motion"
import { HashRouter, useLocation } from "react-router-dom"
import { Switch, Route, Redirect } from "~/MotionRouter"

import Home from "~/views/Home"
import Version from "~/views/Version"
import Settings from "~/views/Settings"
import AppLog from "~/views/AppLog"
import ReactDnD from "~/views/ReactDnD"

export const AppRouter: React.FC = () => {
    return (
        <HashRouter>
            <AnimatePresence exitBeforeEnter>
                <AppSwitch />
            </AnimatePresence>
        </HashRouter>
    )
}

const AppSwitch: React.FC = () => {
    const location = useLocation()

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
        document.querySelector("body").addEventListener("click", h)
        return () => document.querySelector("body").removeEventListener("click", h)
    }, [])

    return (
        <Switch location={location} key={location.pathname}>
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
            <Route path="/version">
                <Version />
            </Route>
            <Route path="/settings">
                <Settings />
            </Route>
            <Route path="/dnd">
                <ReactDnD />
            </Route>
            <Route path="/log">
                <AppLog />
            </Route>
        </Switch>
    )
}
