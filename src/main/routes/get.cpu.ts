import { IpcHandler } from "~/ipc"
import os from "os"

interface CPULoadInfo {
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

const cpuLoadInfo: CPULoadInfo = {
	tick: {
		user: 0,
		nice: 0,
		sys: 0,
		idle: 0,
		irq: 0,
	},
	load: {
		user: 0,
		nice: 0,
		sys: 0,
		idle: 0,
		irq: 0,
	},
}

function updateCPULoad(load: CPULoadInfo) {
	const current = os
		.cpus()
		.map(v => v.times)
		.reduce((pre, cur) => {
			return {
				user: pre.user + cur.user,
				nice: pre.nice + cur.nice,
				sys: pre.sys + cur.sys,
				idle: pre.idle + cur.idle,
				irq: pre.irq + cur.irq,
			}
		})

	const total =
		current.user -
		load.tick.user +
		(current.nice - load.tick.nice) +
		(current.sys - load.tick.sys) +
		(current.idle - load.tick.idle) +
		(current.irq - load.tick.irq)

	if (total > 10) {
		load.load.user = (100.0 * (current.user - load.tick.user)) / total
		load.load.sys = (100.0 * (current.sys - load.tick.sys)) / total
		load.load.nice = (100.0 * (current.nice - load.tick.nice)) / total
		load.load.idle = (100.0 * (current.idle - load.tick.idle)) / total
		load.load.irq = (100.0 * (current.irq - load.tick.irq)) / total
	} else {
		load.load.user = load.load.sys = load.load.nice = load.load.idle = load.load.irq = 0
	}

	load.tick = current
}

export const getCPUUsage: IpcHandler = () => {
	updateCPULoad(cpuLoadInfo)
	return cpuLoadInfo
}
