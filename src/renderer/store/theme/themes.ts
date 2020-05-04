import { tailwindcssconfig } from "~/tailwind.config"

export interface Theme {
	primaryColor: string
	primaryHoverColor: string
	dangerColor: string
	textColor: string
	textHoverColor: string
	backgroundColor: string
}

const colors = tailwindcssconfig.theme.colors

export const themes: { [key: string]: Theme } = {
	light: {
		primaryColor: colors.gray[100],
		primaryHoverColor: colors.gray[300],
		dangerColor: colors.red[400],
		backgroundColor: colors.gray[100],
		textColor: colors.gray[800],
		textHoverColor: colors.gray[600],
	},
	dark: {
		primaryColor: colors.gray[900],
		primaryHoverColor: colors.gray[800],
		dangerColor: colors.red[700],
		backgroundColor: colors.gray[900],
		textColor: colors.gray[200],
		textHoverColor: colors.gray[500],
	},
}

export type ThemeName = "light" | "dark"
