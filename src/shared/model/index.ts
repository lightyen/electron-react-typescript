export interface AutoUpdateInfo {
	version: string
	sha512: string
	releaseDate: string
}

export interface AppPaths {
	userData: string
	temp: string
	home: string
	appData: string
	cache: string
	logs: string
	desktop: string
	documents: string
	music: string
	pictures: string
	downloads: string
}

export interface CPUInfo {
	tick: {
		user: number
		nice: number
		sys: number
		idle: number
		irq: number
	}
	load: {
		user: number
		nice: number
		sys: number
		idle: number
		irq: number
	}
}

export interface SystemMemoryInfo {
	free: number
	total: number
}

export interface UpdateDownloadProgress {
	bytesPerSecond: number
	percent: number
	transferred: number
	total: number
}
