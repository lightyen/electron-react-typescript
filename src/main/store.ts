import ElectronStore from "electron-store"

interface StoreType {
    backgroundColor: string
}

const store = new ElectronStore<StoreType>({
    defaults: {
        backgroundColor: "#1a202c",
    },
})

export default store
