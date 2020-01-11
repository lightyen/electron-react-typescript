import React from "react"
import { HashRouter, Switch, Route, RouteComponentProps } from "react-router-dom"
import { useSelector } from "~/store"
import posed, { PoseGroup } from "react-pose"

import ScrollBar from "~/components/ScrollBar"

import Home from "~/views/Home"
import Version from "~/views/Version"

const RouteContainer = posed.div({
    enter: { height: "100%", opacity: 1, beforeChildren: true },
    exit: { opacity: 0.1 },
})

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
    <PoseGroup>
        <RouteContainer key={location.pathname}>
            <ScrollBar>
                <Switch location={location}>
                    <Route exact path="/" render={props => <Home {...props} />} />
                    <Route path="/version" render={props => <Version {...props} />} />
                </Switch>
            </ScrollBar>
        </RouteContainer>
    </PoseGroup>
)
