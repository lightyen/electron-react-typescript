import React from "react"
import { useSelector, useAction } from "~/store/hooks"
import styled from "@emotion/styled"
import "twin.macro"

const AppFooter = styled.div`
	position: fixed;
	bottom: 0;
	margin-top: 0;
	width: 100%;
	height: calc(var(--footer-height));
	background: rgb(var(--theme-primary));
	user-select: none;
	color: rgb(var(--theme-text-primary));
`

const StatusBar: React.FC<{ hide?: boolean }> = ({ hide }) => {
	if (hide) {
		document.documentElement.style.setProperty("--footer-height", "0px")
	} else {
		document.documentElement.style.setProperty("--footer-height", "32px")
	}

	return (
		!hide && (
			<AppFooter>
				<BarContent />
			</AppFooter>
		)
	)
}

const BarContent: React.FC = () => {
	const usage = useSelector(state => state.app.cpuusage)
	const memory = useSelector(state => state.app.memory)
	const { getCpuUsage, getSystemMemoryInfo } = useAction().app

	React.useEffect(() => {
		let handle = window.setInterval(() => {
			getCpuUsage()
			getSystemMemoryInfo()
		}, 1000)

		return () => {
			if (handle) {
				window.clearInterval(handle)
				handle = 0
			}
		}
	}, [getCpuUsage, getSystemMemoryInfo])

	function getMemInfoString(n: number) {
		if (n < 1024) {
			return `${n} bytes`
		}
		n /= 1024
		if (n < 1024) {
			return `${n.toFixed(1)} KB`
		}
		n /= 1024
		if (n < 1024) {
			return `${n.toFixed(1)} MB`
		}
		n /= 1024
		return `${n.toFixed(1)} GB`
	}
	return (
		<div tw="px-3 py-1 flex">
			<div tw="w-1/2">{usage ? `CPU: ${usage.toFixed(1)}%` : "～"}</div>
			<div tw="w-1/2">
				{memory.free
					? `Memory: ${getMemInfoString(memory.total - memory.free)}/${getMemInfoString(memory.total)}`
					: "～"}
			</div>
		</div>
	)
}

export default StatusBar
