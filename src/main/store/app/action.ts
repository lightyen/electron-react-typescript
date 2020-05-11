import { createAction } from "@reduxjs/toolkit"
export const getVersionsS = createAction<{ versions: { [key: string]: unknown } }>("GET_VERSIONS")
