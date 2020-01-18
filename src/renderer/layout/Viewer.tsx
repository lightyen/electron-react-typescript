import React from "react"
import { HashRouter, Switch, Route, RouteProps, RouteComponentProps } from "react-router-dom"
import { useSelector } from "~/store"
import { AnimatePresence } from "framer-motion"

import ScrollBar from "~/components/ScrollBar"
import { motion, Variants } from "framer-motion"

import Home from "~/views/Home"
import Version from "~/views/Version"

const Viewer: React.FC = () => {
    const backgroundColor = useSelector(state => state.theme.backgroundColor)
    return (
        <div style={{ flexGrow: 1, backgroundColor }}>
            <HashRouter>
                <Route render={props => <AppRouter {...props} />} />
            </HashRouter>
        </div>
    )
}

export default Viewer

const pageVariants: Variants = {
    initial: {
        x: "12%",
        opacity: 0,
    },
    in: {
        x: 0,
        opacity: 1,
    },
}

const MotionRoute: React.FC<RouteProps> = ({ render, ...props }) => {
    return (
        <Route
            {...props}
            render={props => (
                <motion.div initial="initial" animate="in" exit="out" variants={pageVariants}>
                    {render(props)}
                </motion.div>
            )}
        />
    )
}

const AppRouter: React.FC<RouteComponentProps> = ({ location }) => (
    <AnimatePresence initial={false}>
        <ScrollBar>
            <Switch location={location} key={location.pathname}>
                <MotionRoute exact path="/" render={props => <Home {...props} />} />
                <MotionRoute path="/version" render={props => <Version {...props} />} />
            </Switch>
        </ScrollBar>
    </AnimatePresence>
)
