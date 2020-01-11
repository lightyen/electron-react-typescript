import React from "react"
import TitleBar from "~/layout/TitleBar"
import StatusBar from "~/layout/StatusBar"
import Viewer from "~/layout/Viewer"

import { hot } from "react-hot-loader/root"

const AppContainer: React.FC = () => {
    return (
        <>
            <TitleBar />
            <Viewer />
            <StatusBar hide />
        </>
    )
}
export default hot(AppContainer)
