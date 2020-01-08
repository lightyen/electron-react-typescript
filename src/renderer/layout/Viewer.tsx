import React from "react"
import { HashRouter, Switch, Route } from "react-router-dom"
import classnames from "classnames"
import { useSelector } from "~/store"

import Home from "~/views/Home"
import Version from "~/views/Version"

const Viewer: React.FC = () => {
    const name = useSelector(state => state.theme.name)
    return (
        <div
            className={classnames("flex-grow-1", name === "light" ? "bg-light" : "bg-dark")}
            style={{ overflowY: "auto" }}
        >
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
