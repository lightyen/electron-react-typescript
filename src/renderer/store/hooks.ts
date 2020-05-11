import React from "react"
import { bindActionCreators } from "@reduxjs/toolkit"
import { useSelector as useReduxSelector, useDispatch, TypedUseSelectorHook } from "react-redux"
import { RootStore } from "./reducer"

import app from "~/store/app/action"
import theme from "~/store/theme/action"
import i18n from "~/store/i18n/action"

export const useSelector: TypedUseSelectorHook<RootStore> = useReduxSelector

export function useAction() {
	const dispatch = useDispatch()
	return React.useMemo(
		() => ({
			app: bindActionCreators(app, dispatch),
			theme: bindActionCreators(theme, dispatch),
			i18n: bindActionCreators(i18n, dispatch),
		}),
		[dispatch],
	)
}
