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
	titlebar: {
		background: string
	}
}

const colors = tailwindcssconfig.theme.colors

export const themes: { [key: string]: Theme } = {
	light: {
		primary: colors.gray[100],
		primaryVariant: colors.gray[200],
		secondary: "#f0eceb",
		secondaryVariant: "#e8d9d5",
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
			primary: colors.gray[500],
			secondary: "#f5eadc",
			background: colors.gray[500],
			surface: colors.gray[500],
			error: colors.red[200],
			success: colors.green[200],
		},
		titlebar: {
			background: "#e8d9d5",
		},
	},
	dark: {
		primary: "#152840",
		primaryVariant: "#1c324f",
		secondary: "#153640",
		secondaryVariant: "#154039",
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
			secondary: "#1f5e54",
			background: colors.gray[700],
			surface: colors.gray[700],
			error: colors.red[500],
			success: colors.green[500],
		},
		titlebar: {
			background: "#154039",
		},
	},
}

export type ThemeName = "light" | "dark"
