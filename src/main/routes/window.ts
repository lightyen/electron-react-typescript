import { mainWindow } from "~/app"

export const window_close = () => mainWindow.close()
export const window_maximize = () => mainWindow.maximize()
export const window_minimize = () => mainWindow.minimize()
export const window_restore = () => mainWindow.restore()
export const window_isMaximized = () => mainWindow.isMaximized()
