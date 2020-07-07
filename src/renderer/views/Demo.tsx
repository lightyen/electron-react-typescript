import React from "react"
import { Link, useHistory } from "react-router-dom"
import { motion } from "framer-motion"
import Back from "~/components/Back"

import { useScrollBarSource } from "~/components/ScrollBar"

import { useInView } from "react-intersection-observer"
import { openFolderDialog } from "@shared/ipc"
import ColorPicker from "~/components/ColorPicker"
import FileUploader from "~/components/FileUploader"

const Page: React.FC = () => {
	const [text, setText] = React.useState("")
	const history = useHistory()

	return (
		<div className="select-none">
			<Back to="/" />
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
						Settings
					</button>
					<button className="mr-2 btn btn-orange" onClick={() => history.push("/dnd")}>
						DnD
					</button>
					<button className="mr-2 btn btn-green" onClick={() => history.push("/log")}>
						Log
					</button>
				</div>
				{text && <div className="mt-2">{text}</div>}
				<div>
					<h2 className="text-lg mt-6 mb-3">Color Picker</h2>
					<ColorPicker onChange={e => console.log(e.hex())} />
				</div>
				<div className="mt-2 bg-gray-500 flex items-end" style={{ width: 300, height: 1300 }}>
					<IntersectTarget />
				</div>
				<Link
					to="/"
					className="inline-block mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
				>
					Home
				</Link>
			</div>
		</div>
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

export default Page
