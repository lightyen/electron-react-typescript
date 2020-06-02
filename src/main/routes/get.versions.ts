import { appVersions } from "shared/ipc"
import { store } from "~/store"

appVersions.handle(() => store.getState().app.versions)
