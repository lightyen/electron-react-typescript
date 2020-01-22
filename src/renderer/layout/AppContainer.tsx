import React from "react"
import TitleBar from "~/layout/TitleBar"
import StatusBar from "~/layout/StatusBar"
import Viewer from "~/layout/Viewer"
import AutoUpdater from "~/components/AutoUpdater"

import { hot } from "react-hot-loader/root"

const AppContainer: React.FC = () => {
    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", flex: "0 0 100%" }}>
            <TitleBar />
            <Viewer />
            <StatusBar hide />
            <AutoUpdater />
        </div>
    )
}
export default hot(AppContainer)
