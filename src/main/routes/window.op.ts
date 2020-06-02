import { mainWindow } from "~/app"
import { windowClose, windowMaximize, windowMinimize, windowRestore, windowIsMaximized } from "shared/ipc"

windowClose.on(() => mainWindow.close())
windowMaximize.on(() => mainWindow.maximize())
windowMinimize.on(() => mainWindow.minimize())
windowRestore.on(() => mainWindow.restore())
windowIsMaximized.handle(() => mainWindow.isMaximized())
