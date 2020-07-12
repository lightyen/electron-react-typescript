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
export default () => {
	const [text, setText] = React.useState("")
	const history = useHistory()

	const [open, setOpen] = React.useState(false)
	return (
		<Page>
			<div className="mx-3 my-2">
				<FileUploader />
				<div className="mt-2">
					<button
						className="mr-2 btn btn-blue"
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
					</button>
					<button className="mr-2 btn btn-blue" onClick={() => history.push("/settings")}>
						<FormattedMessage id="nav_settings" />
					</button>
					<button className="mr-2 btn btn-orange" onClick={() => history.push("/dnd")}>
						DnD
					</button>
					<button className="mr-2 btn btn-green" onClick={() => history.push("/log")}>
						Log
					</button>
					<button className="btn mr-3 inline-flex items-center" onClick={e => setOpen(true)}>
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
					</button>
					<Modal open={open} onMouseDownOutside={e => setOpen(false)}>
						<div className="px-6 my-3">
							<div className="mt-4 mb-2">
								<div className="font-bold text-xl mb-2 capitalize">
									<FormattedMessage id="title" />
								</div>
							</div>
							<div className="h-12 mb-3">bla bla bla...</div>
							<div className="mb-3 flex justify-end">
								<button
									className="btn btn-blue flex items-center"
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
								</button>
							</div>
						</div>
					</Modal>
				</div>
				{text && <div className="mt-2">{text}</div>}
				<div>
					<h2 className="text-lg mt-6 mb-3">Color Picker</h2>
					<ColorPicker onChange={e => console.log(e.hex())} />
				</div>
				<div className="mt-2 bg-gray-500 flex items-end" style={{ width: 300, height: 1300 }}>
					<IntersectTarget />
				</div>
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
