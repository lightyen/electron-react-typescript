import { storage } from "~/store"
import { setDefaultBackgroundColor, setDefaultAutoUpdate } from "shared/ipc"

setDefaultBackgroundColor.on((_, color) => storage.set("backgroundColor", color))
setDefaultAutoUpdate.on((_, enable) => storage.set("autoUpdate", enable))
