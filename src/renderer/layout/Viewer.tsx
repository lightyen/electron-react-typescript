import React from "react"
import { HashRouter, Switch, Route, RouteComponentProps } from "react-router-dom"
import { useSelector } from "~/store"
import { AnimatePresence } from "framer-motion"

import ScrollBar from "~/components/ScrollBar"

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

const AppRouter: React.FC<RouteComponentProps> = ({ location }) => (
    <AnimatePresence initial={false}>
        <ScrollBar>
            <Switch location={location} key={location.pathname}>
                <Route exact path="/" render={props => <Home {...props} />} />
                <Route path="/version" render={props => <Version {...props} />} />
            </Switch>
        </ScrollBar>
    </AnimatePresence>
)
