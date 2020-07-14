import React from "react"
import ReactDOM from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import styled from "@emotion/styled"
import tw from "twin.macro"

interface Props extends ModalContentProps {
	open?: boolean
	afterClose?: () => void
}

export const Modal: React.FC<Props> = ({ children, open = false, exitAnime = true, afterClose, ...rest }) => {
	const root = document.getElementById("root")
	const modalRoot = document.getElementById("modal-root")
	const element = React.useRef(document.createElement("div"))
	const [visible, setVisible] = React.useState(open)

	function onExitComplete() {
		setVisible(false)
		modalRoot.style.bottom = ""
	}

	React.useEffect(() => {
		if (open) {
			setVisible(open)
		} else if (!exitAnime) {
			setVisible(false)
			modalRoot.style.bottom = ""
		}
	}, [open, modalRoot, exitAnime])

	const isOpen = React.useRef(false)
	React.useEffect(() => {
		if (isOpen.current && !visible && afterClose) {
			afterClose()
		}
		return () => {
			isOpen.current = visible
		}
	}, [afterClose, visible])

	React.useEffect(() => {
		const e = element.current
		function wheel(e: Event) {
			e.stopPropagation()
		}
		function keydown(e: KeyboardEvent) {
			e.preventDefault()
		}
		if (visible) {
			e.style.width = "100%"
			e.style.height = "100%"
			modalRoot.appendChild(e)
			modalRoot.style.bottom = "0%"
			modalRoot.addEventListener("wheel", wheel, { passive: true })
			root.addEventListener("keydown", keydown)
		}
		return () => {
			modalRoot.removeEventListener("wheel", wheel)
			root.removeEventListener("keydown", keydown)
			if (visible) {
				modalRoot.removeChild(e)
			}
		}
	}, [root, modalRoot, visible])

	return ReactDOM.createPortal(
		exitAnime ? (
			<AnimatePresence onExitComplete={onExitComplete}>
				{open && (
					<ModalContent exitAnime={exitAnime} {...rest}>
						{children}
					</ModalContent>
				)}
			</AnimatePresence>
		) : (
			open && (
				<ModalContent exitAnime={exitAnime} {...rest}>
					{children}
				</ModalContent>
			)
		),
		element.current,
	)
}

interface ModalContentProps {
	id?: string
	className?: string
	style?: React.CSSProperties
	exitAnime?: boolean
	onMouseDownOutside?: (e: MouseEvent) => void
}

const Cover = styled.div`
	background-color: var(--theme-modal-cover-bg);
	backdrop-filter: blur(1px);
	z-index: 9999;
	${tw`w-full h-full flex justify-center items-center`}
`

const ModalBox = styled.div`
	background-color: var(--theme-surface);
	filter: drop-shadow(2px 2px 8px var(--theme-modal-shadow));
	${tw` w-64 rounded`}
`

const ModalContent: React.FC<ModalContentProps> = ({
	children,
	onMouseDownOutside,
	exitAnime,
	className = "",
	...props
}) => {
	const ref = React.useRef<HTMLDivElement>()
	React.useEffect(() => {
		const modal = ref.current
		function onMouseDown(e: MouseEvent) {
			if (!modal.contains(e.target as Node)) {
				onMouseDownOutside(e)
			}
		}
		window.addEventListener("mousedown", onMouseDown)
		return () => window.removeEventListener("mousedown", onMouseDown)
	}, [onMouseDownOutside])

	return (
		<motion.div
			style={{ height: "100%" }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={exitAnime ? { opacity: 0 } : undefined}
		>
			<Cover>
				<ModalBox ref={ref} className={className} {...props}>
					{children}
				</ModalBox>
			</Cover>
		</motion.div>
	)
}
