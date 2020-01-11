import React from "react"
import { HashRouter, Switch, Route } from "react-router-dom"
import { useSelector } from "~/store"

import Home from "~/views/Home"
import Version from "~/views/Version"

const Viewer: React.FC = () => {
    const backgroundColor = useSelector(state => state.theme.backgroundColor)
    return (
        <div style={{ flexGrow: 1, backgroundColor }}>
            <HashRouter>
                <Switch>
                    <Route path="/" exact render={props => <Home {...props} />} />
                    <Route path="/version" render={props => <Version {...props} />} />
                </Switch>
            </HashRouter>
        </div>
    )
}

export default Viewer
