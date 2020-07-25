import React from "react"
import { useSelector } from "~/store"
import { ThemeProvider } from "emotion-theming"

const StyledThemeProvider: React.FC = ({ children }) => {
	const theme = useSelector(state => state.theme)
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default StyledThemeProvider
