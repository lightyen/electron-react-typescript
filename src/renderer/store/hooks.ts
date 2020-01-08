import React from "react"
import { bindActionCreators } from "redux"
import { useSelector as useReduxSelector, useDispatch, TypedUseSelectorHook } from "react-redux"
import { RootStore } from "~/store"
import app from "~/store/app/action"
import theme from "~/store/theme/action"

export const useSelector: TypedUseSelectorHook<RootStore> = useReduxSelector

export function useAction() {
    const dispatch = useDispatch()
    return React.useMemo(
        () => ({
            app: bindActionCreators(app, dispatch),
            theme: bindActionCreators(theme, dispatch),
        }),
        [dispatch],
    )
}
