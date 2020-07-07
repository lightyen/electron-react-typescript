import React from "react"
import { dndimages } from "@shared/ipc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload"
import classnames from "classnames"

const FileUploader: React.FC = () => {
	const [hover, setHover] = React.useState(false)
	return (
		<div className="flex flex-col cursor-pointer" style={{ width: 300, height: 220 }}>
			<div
				className={classnames("flex flex-grow justify-center items-center m-3 border-file-uploader", { hover })}
				onClick={async () => {
					dndimages.send()
				}}
				onDragOver={e => {
					e.preventDefault()
				}}
				onDragEnter={e => setHover(true)}
				onDragLeave={e => setHover(false)}
				onDrop={async e => {
					e.preventDefault()
					dndimages.send(Array.from(e.dataTransfer.files).map(v => v.path))
					console.log(Array.from(e.dataTransfer.files).map(v => v.type))
				}}
			>
				<FontAwesomeIcon className="pointer-events-none" icon={faFileUpload} size="2x" />
			</div>
		</div>
	)
}

export default FileUploader
