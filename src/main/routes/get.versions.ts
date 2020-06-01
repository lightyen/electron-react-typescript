import { chVersions } from "@/channels"
import { store } from "~/store"

chVersions.handle(async () => store.getState().app.versions)
