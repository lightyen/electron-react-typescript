import React, { Suspense } from "react"
import { useSelector } from "~/store"

const AppRouter = React.lazy(() => import("~/router"))

const Viewer: React.FC = () => {
    const backgroundColor = useSelector(state => state.theme.backgroundColor)
    return (
        <div style={{ flexGrow: 1, transition: "all 0.2s ease" }}>
            <Suspense fallback={<></>}>
                <AppRouter />
            </Suspense>
        </div>
    )
}

export default Viewer
