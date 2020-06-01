import { createAction } from "@reduxjs/toolkit"
import { Versions } from "@/model"
export const getVersionsS = createAction<{ versions: Versions }>("GET_VERSIONS")
