import os from "os"
import { memoryUsage } from "shared/ipc"

memoryUsage.handle(() => ({
	free: os.freemem(),
	total: os.totalmem(),
}))
