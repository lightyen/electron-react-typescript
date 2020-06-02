import { createIPC } from "./ipc"

import { Versions } from "./model"

export const chVersions = createIPC<null, Versions>("get.versions")
