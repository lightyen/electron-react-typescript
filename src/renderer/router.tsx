import React from "react"
import { AnimatePresence } from "framer-motion"
import { HashRouter, useLocation } from "react-router-dom"
import { Switch, Route, Redirect } from "~/MotionRouter"

import Home from "~/views/Home"
import Version from "~/views/Version"
import Settings from "~/views/Settings"
import AppLog from "~/views/AppLog"

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
            <Route path="/" exact>
                <Home />
            </Route>
            <Route path="/version">
                <Version />
            </Route>
            <Route path="/settings">
                <Settings />
            </Route>
            <Route path="/log">
                <AppLog />
            </Route>
        </Switch>
    )
}

export default AppRouter
