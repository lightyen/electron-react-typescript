import ElectronStore from "electron-store"

interface StoreType {
    autoUpdate: boolean
    backgroundColor: string
}

export const store = new ElectronStore<StoreType>({
    defaults: {
        autoUpdate: false,
        backgroundColor: "#1a202c",
    },
})
