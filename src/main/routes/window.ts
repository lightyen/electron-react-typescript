import { IpcHandler } from "~/ipc"
import { mainWindow } from "~/app"

export const window_close: IpcHandler = () => mainWindow.close()
export const window_maximize: IpcHandler = () => mainWindow.maximize()
export const window_minimize: IpcHandler = () => mainWindow.minimize()
export const window_restore: IpcHandler = () => mainWindow.restore()
export const window_isMaximized: IpcHandler = () => mainWindow.isMaximized()
