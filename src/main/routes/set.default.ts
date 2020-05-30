import { storage } from "~/store"

export const setBackgroundColor = (_, color: string) => {
	storage.set("backgroundColor", color)
}

export const setAutoUpdate = (_, enable: boolean) => {
	storage.set("autoUpdate", enable)
}
