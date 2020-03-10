import React from "react"
import { AnimatePresence } from "framer-motion"
import { HashRouter, useLocation } from "react-router-dom"
import { Switch, Route, Redirect } from "~/MotionRouter"

import Home from "~/views/Home"
import Version from "~/views/Version"
import Settings from "~/views/Settings"
import AppLog from "~/views/AppLog"
import ReactDnD from "~/views/ReactDnD"

const AppRouter: React.FC = () => {
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

export default AppRouter
