export const GET_VERSIONS = "GET_VERSIONS"

export interface GetVersionsAction {
	type: typeof GET_VERSIONS
	versions?: { [key: string]: unknown }
}

export type Action = GetVersionsAction
