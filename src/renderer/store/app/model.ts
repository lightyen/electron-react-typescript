export interface Version {
    app: string
    electron: string
    node: string
    chrome: string
    os: { name: string; version: string }
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

export interface UpdateInfo {
    version: string
    sha512: string
    releaseDate: string
}

export interface UpdateDownloadProgress {
    bytesPerSecond: number
    percent: number
    transferred: number
    total: number
}
