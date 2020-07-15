import React from "react"
import { useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import Page from "~/components/Page"

import { useScrollBarSource } from "~/components/ScrollBar"

import { useInView } from "react-intersection-observer"
import { openFolderDialog } from "@shared/ipc"
import ColorPicker from "~/components/ColorPicker"
import FileUploader from "~/components/FileUploader"

import { FormattedMessage } from "react-intl"
import { Modal } from "~/components/Modal"

import { css } from "@emotion/core"
import styled from "@emotion/styled"
import tw from "twin.macro"

interface ButtonProps {
	variant?: "none" | "black" | "blue" | "green" | "orange" | "red"
}

const Button = styled.button<ButtonProps>(({ variant = "none" }) => {
	return [
		css`
			transition-property: background-color, box-shadow;
			transition-duration: 200ms;
			transition-timing-function: ease;
		`,
		tw`py-3 px-6 rounded text-white leading-none`,
		variant === "none" &&
			css`
				background: rgb(var(--theme-btn-background));
				:focus {
					box-shadow: 0 0 0 3px rgb(var(--theme-btn-focus-shadow));
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgb(var(--theme-btn-focus-shadow));
					background: rgb(var(--theme-btn-background-hover));
				}
			`,
		variant === "black" &&
			css`
				${tw`bg-gray-900 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(26, 32, 44, 0.5);
					${tw`outline-none`}
				}
				:hover {
					${tw`bg-gray-800`}
				}
			`,
		variant === "blue" &&
			css`
				${tw`bg-blue-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
					${tw`bg-blue-600`}
				}
			`,
		variant === "green" &&
			css`
				${tw`bg-green-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.5);
					${tw`bg-green-600`}
				}
			`,
		variant === "orange" &&
			css`
				${tw`bg-orange-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.5);
					${tw`bg-orange-600`}
				}
			`,
		variant === "red" &&
			css`
				${tw`bg-red-500 text-white`}
				:focus {
					box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.5);
					${tw`outline-none`}
				}
				:hover {
					box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.5);
					${tw`bg-red-600`}
				}
			`,
	]
})

export default () => {
	const [text, setText] = React.useState("")
	const history = useHistory()

	const [open, setOpen] = React.useState(false)
	return (
		<Page>
			<div className="mb-2">
				<FileUploader />
			</div>
			<div>
				<Button
					variant="blue"
					className="mr-2 mb-2"
					onClick={async () => {
						const { filePaths } = await openFolderDialog.invoke({
							title: "Select a folder",
							properties: ["openDirectory"],
						})
						if (filePaths) {
							setText(filePaths.length > 0 ? filePaths[0] : "")
						}
					}}
				>
					Open Dialog
				</Button>
				<Button variant="blue" className="mr-2 mb-2" onClick={() => history.push("/settings")}>
					<FormattedMessage id="nav_settings" />
				</Button>
				<Button variant="orange" className="mr-2 mb-2" onClick={() => history.push("/dnd")}>
					DnD
				</Button>
				<Button variant="green" className="mr-2 mb-2" onClick={() => history.push("/log")}>
					Log
				</Button>
				<Button className="mr-2 mb-2 inline-flex items-center" onClick={e => setOpen(true)}>
					<svg
						id="i-eject"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 32 32"
						width="14"
						height="14"
						fill="none"
						stroke="currentcolor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					>
						<path d="M30 18 L16 5 2 18Z M2 25 L30 25" />
					</svg>
					<span className="pl-2">
						<FormattedMessage id="modal" />
					</span>
				</Button>
				<Modal open={open} onMouseDownOutside={e => setOpen(false)}>
					<div className="px-6 my-3">
						<div className="mt-4 mb-2">
							<div className="font-bold text-xl mb-2 capitalize">
								<FormattedMessage id="title" />
							</div>
						</div>
						<div className="h-12 mb-3">bla bla bla...</div>
						<div className="mb-3 flex justify-end">
							<Button
								className="flex items-center"
								onClick={e => {
									e.preventDefault()
									e.stopPropagation()
									setOpen(false)
								}}
							>
								<svg
									id="i-checkmark"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 32 32"
									width="16"
									height="16"
									fill="none"
									stroke="currentcolor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="4"
								>
									<path d="M2 20 L12 28 30 4" />
								</svg>
								<span className="pl-2">
									<FormattedMessage id="ok" />
								</span>
							</Button>
						</div>
					</div>
				</Modal>
			</div>
			{text && <div className="mt-2">{text}</div>}
			<div>
				<h2 className="text-lg mt-6 mb-3">Color Picker</h2>
				<ColorPicker />
			</div>
			<div className="mt-2 bg-gray-500 flex items-end" style={{ width: 300, height: 1300 }}>
				<IntersectTarget />
			</div>
		</Page>
	)
}

const IntersectTarget: React.FC = () => {
	const root = useScrollBarSource()
	const [ref, inView, entry] = useInView({ root, threshold: 1 })
	React.useEffect(() => {
		if (entry) {
			// console.log(entry.intersectionRatio)
		}
	}, [entry])
	return (
		<motion.div
			ref={ref}
			className="p-6 mb-24 ml-3 w-40 text-center"
			initial={{
				color: "rgb(26, 32, 44)",
				backgroundColor: "rgb(237, 242, 247)",
			}}
			animate={{
				color: inView ? "rgb(247, 250, 252)" : "rgb(26, 32, 44)",
				backgroundColor: inView ? "rgb(74, 85, 104)" : "rgb(237, 242, 247)",
			}}
		>
			{inView ? "inView" : "outside"}
		</motion.div>
	)
}
