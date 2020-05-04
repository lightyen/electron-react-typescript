import React from "react"
import { Link, useHistory } from "react-router-dom"
import AppVersion from "./AppVersion"
import Back from "~/components/Back"

import { request } from "~/ipc"
import { useSelector } from "~/store"
import { useScrollBarTarget } from "~/components/ScrollBar"

const Page: React.FC = ({}) => {
	const textColor = useSelector(state => state.theme.textColor)
	const [text, setText] = React.useState("")
	const history = useHistory()

	return (
		<div className="select-none">
			<Back to="/" />
			<div className="mx-3 my-2">
				<AppVersion />
				<div className="mt-2">
					<button
						className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => {
							request<{
								filePaths: string[]
								files: string[]
							}>("dialog.open").then(data => {
								const { filePaths } = data
								setText(filePaths[0])
							})
						}}
					>
						Open Dialog
					</button>
					<button
						className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => history.push("/settings")}
					>
						Settings
					</button>
					<button
						className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => history.push("/dnd")}
					>
						DnD
					</button>
					<button
						className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
						onClick={() => history.push("/log")}
					>
						Log
					</button>
				</div>
				{text && (
					<div className="mt-2" style={{ color: textColor }}>
						{text}
					</div>
				)}
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

import { useInView } from "react-intersection-observer"

const IntersectTarget: React.FC = () => {
	const root = useScrollBarTarget()
	const [ref, inView, entry] = useInView({ root, threshold: 1 })
	React.useEffect(() => {
		if (entry) {
			console.log(entry.intersectionRatio)
		}
	}, [entry])
	return (
		<div ref={ref} className={"p-6 mb-24 " + (inView ? "text-gray-100 bg-gray-700" : "text-gray-900 bg-gray-200")}>
			Target {inView ? "inView" : "outside"}
		</div>
	)
}

export default Page
