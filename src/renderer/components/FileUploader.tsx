import React from "react"
import { dndimages } from "@shared/ipc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload"

const FileUploader: React.FC = () => {
	return (
		<div
			className="flex flex-col"
			style={{ width: 300, height: 220 }}
			onDragOver={e => e.preventDefault()}
			onDrop={async e => {
				e.preventDefault()
				dndimages.send(Array.from(e.dataTransfer.files).map(v => v.path))
				console.log(Array.from(e.dataTransfer.files).map(v => v.type))
			}}
		>
			<div
				className="flex flex-grow justify-center items-center m-3 border-file-uploader"
				onClick={async () => {
					dndimages.send()
				}}
			>
				<FontAwesomeIcon icon={faFileUpload} size="2x" />
			</div>
		</div>
	)
}

export default FileUploader
