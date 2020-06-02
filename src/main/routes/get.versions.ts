import { chVersions } from "@/channels"
import { store } from "~/store"

chVersions.handle(() => store.getState().app.versions)
