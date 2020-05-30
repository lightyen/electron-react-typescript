import os from "os"

export const getMemory = () => {
	return {
		free: os.freemem(),
		total: os.totalmem(),
	}
}
