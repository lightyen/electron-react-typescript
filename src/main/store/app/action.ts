import { createAction } from "@reduxjs/toolkit"
import { Versions } from "shared/model"
export const getVersionsS = createAction<{ versions: Versions }>("GET_VERSIONS")
