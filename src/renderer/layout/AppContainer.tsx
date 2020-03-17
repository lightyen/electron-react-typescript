import React, { Suspense } from "react"
import { hot } from "react-hot-loader/root"

import TitleBar from "./TitleBar"
import StatusBar from "./StatusBar"
import Viewer from "./Viewer"
import AutoUpdater from "./AutoUpdater"

const AppContainer: React.FC = () => {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <TitleBar />
            <Viewer />
            <StatusBar hide />
            <AutoUpdater />
        </div>
    )
}
export default hot(AppContainer)
