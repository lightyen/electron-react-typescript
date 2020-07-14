import React from "react"
import { useTheme } from "~/store"
import { ThemeProvider } from "emotion-theming"

const StyledThemeProvider: React.FC = ({ children }) => {
	const theme = useTheme()
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default StyledThemeProvider
