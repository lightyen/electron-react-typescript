import React from "react"
import { useSelector } from "~/store/hooks"
import { ThemeProvider } from "emotion-theming"

const StyledThemeProvider = ({ children }: React.PropsWithChildren<unknown>) => {
	const theme = useSelector(state => state.theme)
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default StyledThemeProvider
