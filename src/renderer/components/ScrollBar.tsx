import React from "react"
import { useTheme } from "~/store"
import styled from "@emotion/styled"
import tw from "twin.macro"
interface ScrollBarProps {
	/** Color with scrollbar thumb, ex: #cccccc */
	color: string
	/** The width of scrollbar thumb */
	width: number
	padding: number
}

// https://css-tricks.com/custom-scrollbars-in-webkit/
const CustomScrollBar = styled.div`
	color: transparent;
	transition: color 600ms ease;
	${tw`h-full overflow-x-hidden overflow-y-scroll flex-grow`}
	::-webkit-scrollbar-track {
		display: none;
	}
	::-webkit-scrollbar {
		width: ${({ width, padding }: ScrollBarProps) => width + padding * 2}px;
		height: ${({ width, padding }: ScrollBarProps) => width + padding * 2}px;
	}
	:hover {
		color: ${({ color }) => color}80;
	}
	::-webkit-scrollbar-thumb {
		border-radius: ${({ width, padding }) => width / 2 + padding}px;
		border: ${({ padding }) => padding}px solid transparent;
		box-shadow: inset 0 0 0 100px;
	}
`

export const ScrollBarContext = React.createContext<HTMLDivElement>(null)
const ScrollBarVisibleContext = React.createContext<boolean>(null)

export function useScrollBarSource() {
	return React.useContext(ScrollBarContext)
}

export function useScollBarVisible() {
	return React.useContext(ScrollBarVisibleContext)
}

const ScrollBar: React.FC = ({ children, ...rest }) => {
	const {
		text: { background: color },
	} = useTheme()
	const ref = React.useRef<HTMLDivElement>()
	const [handle, setHandle] = React.useState<HTMLDivElement>()
	const isMount = React.useRef(false)
	React.useEffect(() => {
		isMount.current = true
		setHandle(ref.current)
		return () => {
			isMount.current = false
		}
	}, [])

	const [visible, setVisible] = React.useState(false)
	React.useEffect(() => {
		if (!handle) {
			return () => {
				/** */
			}
		}
		const el = handle.children[0]
		const observer = new ResizeObserver(entries => {
			setVisible(handle.scrollHeight > handle.clientHeight)
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [handle])

	return (
		<CustomScrollBar ref={ref} color={color} width={8} padding={6} className="scrollbar" {...rest}>
			{handle && (
				<ScrollBarContext.Provider value={handle}>
					<ScrollBarVisibleContext.Provider value={visible}>{children}</ScrollBarVisibleContext.Provider>
				</ScrollBarContext.Provider>
			)}
		</CustomScrollBar>
	)
}

export default ScrollBar
