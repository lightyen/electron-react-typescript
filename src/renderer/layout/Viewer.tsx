import React from "react"
import { HashRouter, Switch, Route, Redirect, useLocation, RouteProps, RedirectProps } from "react-router-dom"
import { useSelector } from "~/store"
import { AnimatePresence } from "framer-motion"

import ScrollBar from "~/components/ScrollBar"
import { motion, Variants } from "framer-motion"

import Home from "~/views/Home"
import Version from "~/views/Version"

const pageVariants: Variants = {
    initial: {
        x: "12%",
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
}

const MotionRoute: React.FC<RouteProps> = ({ children, ...props }) => {
    return (
        <Route {...props}>
            <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} style={{ flex: "1 1 auto" }}>
                <ScrollBar>{children}</ScrollBar>
            </motion.div>
        </Route>
    )
}

const MotionRedirect: React.FC<RedirectProps> = ({ children, ...props }) => (
    <motion.div exit="undefined">
        <Redirect {...props} />
    </motion.div>
)

const AppRouter: React.FC = () => {
    const location = useLocation()
    return (
        <AnimatePresence exitBeforeEnter initial={false}>
            <Switch location={location} key={location.pathname}>
                <MotionRoute path="/" exact>
                    <Home />
                </MotionRoute>
                <MotionRoute path="/version">
                    <Version />
                </MotionRoute>
            </Switch>
        </AnimatePresence>
    )
}

const Viewer: React.FC = () => {
    const backgroundColor = useSelector(state => state.theme.backgroundColor)
    return (
        <div style={{ flexGrow: 1, backgroundColor, display: "flex", transition: "all 0.2s ease" }}>
            <HashRouter>
                <Route>
                    <AppRouter />
                </Route>
            </HashRouter>
        </div>
    )
}

export default Viewer
