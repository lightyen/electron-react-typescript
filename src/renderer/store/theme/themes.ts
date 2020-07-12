import chroma from "chroma-js"
import { tailwindcssconfig } from "~/tailwind.config"
import { setDefaultBackgroundColor } from "@shared/ipc"

const colors = tailwindcssconfig.theme.colors

export const themes = {
	light: {
		primary: colors.gray[100],
		primaryVariant: colors.gray[200],
		secondary: "#f0eceb",
		secondaryVariant: "#e8d9d5",
		background: colors.gray[100],
		surface: "#eeeeee",
		error: colors.red[500],
		success: colors.green[500],

		hover: {
			primary: colors.gray[400],
			secondary: "#c7aea7",
			background: colors.gray[500],
			surface: colors.gray[700],
			error: colors.red[200],
			success: colors.green[200],
		},
		text: {
			primary: colors.gray[900],
			secondary: colors.gray[900],
			background: colors.gray[900],
			surface: "#323232",
			error: colors.gray[900],
			success: colors.gray[900],
		},
		active: {
			primary: colors.gray[700],
			secondary: colors.gray[700],
			background: colors.gray[700],
			surface: colors.gray[700],
		},
		titlebar: {
			background: colors.gray[100],
		},
	},
	dark: {
		primary: colors.darkslategray[900],
		primaryVariant: colors.darkslategray[800],
		secondary: colors.gray[900],
		secondaryVariant: colors.gray[800],
		background: colors.gray[900],
		surface: "#323232",
		error: colors.red[600],
		success: colors.green[600],
		hover: {
			primary: colors.darkslategray[700],
			secondary: colors.gray[700],
			background: colors.gray[700],
			surface: "#838383",
			error: colors.red[500],
			success: colors.green[500],
		},
		text: {
			primary: colors.gray[100],
			secondary: colors.gray[100],
			background: colors.gray[100],
			surface: "#eeeeee",
			error: colors.gray[100],
			success: colors.gray[100],
		},
		active: {
			primary: colors.darkslategray[300],
			secondary: colors.gray[300],
			background: colors.gray[300],
			surface: colors.darkslategray[300],
		},
		titlebar: {
			background: colors.gray[900],
		},
	},
}

export type ThemeMode = keyof typeof themes

export type Theme = typeof themes["light"]

// You will need to change gtk3 theme and restart the browser if you are on linux.
const darkmodeQuery = window.matchMedia("(prefers-color-scheme: dark)")

function getTheme(): ThemeMode {
	const theme = localStorage.getItem("theme")
	if (theme == "dark") {
		return "dark"
	}
	if (theme == "light") {
		return "light"
	}
	// auto
	const darkmode = darkmodeQuery.matches
	if (darkmode) {
		return "dark"
	}
	return "light"
}

function setTheme(obj: Theme, prefix = "--theme") {
	const root = document.documentElement
	for (const key in obj) {
		if (typeof obj[key] === "string") {
			root.style.setProperty(prefix + "-" + key.toLowerCase(), obj[key])
		} else {
			setTheme(obj[key], prefix + "-" + key.toLowerCase())
		}
	}
}

export function prepareTheme(name = "", cached = false) {
	const theme = themes[name || getTheme()]
	document.body.style.color = theme.text.background
	document.body.style.backgroundColor = theme.background
	const root = document.documentElement
	const color = chroma(theme.primary)
	root.style.setProperty("--theme-btn-background", color.set("hsv.v", "0.5").css())
	root.style.setProperty("--theme-btn-background-hover", color.set("hsv.v", "0.7").css())
	root.style.setProperty("--theme-btn-focus-shadow", color.set("hsv.v", "0.5").alpha(0.7).css())
	setTheme(theme)

	root.style.setProperty("--theme-modal-cover-bg", chroma(theme.text.background).alpha(0.5).css())
	root.style.setProperty("--theme-modal-shadow", chroma(theme.background).alpha(0.2).css())
	root.style.setProperty("--theme-shadow", chroma(theme.text.background).alpha(0.2).css())
	root.style.setProperty("--theme-shadow-ambient", chroma(theme.text.background).alpha(0.05).css())

	const bg = chroma(theme.primary)
	const darkmode = bg.luminance() < 0.3

	if (cached) {
		localStorage.setItem("theme", name)
		setDefaultBackgroundColor.send(theme.background)
	}
	return { ...theme, name: darkmode ? "dark" : "light" }
}
