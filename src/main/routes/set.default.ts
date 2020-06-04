import { setDefaultBackgroundColor, setDefaultAutoUpdate } from "shared/ipc"

setDefaultBackgroundColor.on((_, color) => global.storage.set("backgroundColor", color))
setDefaultAutoUpdate.on((_, enable) => global.storage.set("autoUpdate", enable))
