import { windowClose, windowMaximize, windowMinimize, windowRestore, windowIsMaximized } from "@shared/ipc"

windowClose.on(() => global.mainWindow.close())
windowMaximize.on(() => global.mainWindow.maximize())
windowMinimize.on(() => global.mainWindow.minimize())
windowRestore.on(() => global.mainWindow.restore())
windowIsMaximized.handle(() => global.mainWindow.isMaximized())
