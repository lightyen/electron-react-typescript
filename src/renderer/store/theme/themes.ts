import { tailwindcssconfig } from "~/tailwind.config"

export interface Theme {
	primary: string
	primaryVariant: string
	secondary: string
	secondaryVariant: string
	background: string
	surface: string
	error: string
	success: string
	text: {
		primary: string
		secondary: string
		background: string
		surface: string
		error: string
		success: string
	}
	hover: {
		primary: string
		secondary: string
		background: string
		surface: string
		error: string
		success: string
	}
}

const colors = tailwindcssconfig.theme.colors

export const themes: { [key: string]: Theme } = {
	light: {
		primary: colors.gray[100],
		primaryVariant: colors.gray[300],
		secondary: colors.teal[200],
		secondaryVariant: colors.teal[300],
		background: colors.gray[100],
		surface: colors.gray[100],
		error: colors.red[500],
		success: colors.green[500],
		text: {
			primary: colors.gray[900],
			secondary: colors.gray[900],
			background: colors.gray[900],
			surface: colors.gray[900],
			error: colors.gray[900],
			success: colors.gray[900],
		},
		hover: {
			primary: colors.gray[400],
			secondary: colors.teal[400],
			background: colors.gray[200],
			surface: colors.gray[200],
			error: colors.red[200],
			success: colors.green[200],
		},
	},
	dark: {
		primary: colors.gray[900],
		primaryVariant: colors.gray[800],
		secondary: colors.blue[900],
		secondaryVariant: colors.blue[700],
		background: colors.gray[900],
		surface: colors.gray[900],
		error: colors.red[600],
		success: colors.green[600],
		text: {
			primary: colors.gray[100],
			secondary: colors.gray[100],
			background: colors.gray[100],
			surface: colors.gray[100],
			error: colors.gray[100],
			success: colors.gray[100],
		},
		hover: {
			primary: colors.gray[700],
			secondary: colors.blue[700],
			background: colors.gray[700],
			surface: colors.gray[700],
			error: colors.red[500],
			success: colors.green[500],
		},
	},
}

export type ThemeName = "light" | "dark"
