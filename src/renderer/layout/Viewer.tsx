import React from "react"
import { HashRouter, Switch, Route, RouteComponentProps, RouteProps } from "react-router-dom"
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

const MotionRoute: React.FC<RouteProps & { first?: boolean }> = ({ render, first, ...props }) => {
    return (
        <Route
            {...props}
            render={props => (
                <motion.div
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    style={{ flex: "1 1 auto" }}
                >
                    <ScrollBar>{render(props)}</ScrollBar>
                </motion.div>
            )}
        />
    )
}

const AppRouter: React.FC<RouteComponentProps> = ({ location }) => (
    <AnimatePresence initial={false} exitBeforeEnter>
        <Switch location={location} key={location.pathname}>
            <MotionRoute exact path="/" first render={props => <Home {...props} />} />
            <MotionRoute path="/version" render={props => <Version {...props} />} />
        </Switch>
    </AnimatePresence>
)

const Viewer: React.FC = () => {
    const backgroundColor = useSelector(state => state.theme.backgroundColor)
    return (
        <div style={{ flexGrow: 1, backgroundColor, display: "flex", transition: "all 0.2s ease" }}>
            <HashRouter>
                <Route render={props => <AppRouter {...props} />} />
            </HashRouter>
        </div>
    )
}

export default Viewer
