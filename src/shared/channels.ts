import { IPC } from "./ipc"

import { Versions } from "./model"

export const chVersions = new IPC<null, Versions>("get.versions")
