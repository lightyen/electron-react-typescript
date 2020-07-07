import React from "react"
import { dndimages } from "@shared/ipc"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileUpload } from "@fortawesome/free-solid-svg-icons/faFileUpload"
import styled from "styled-components"
import { Theme } from "~/store/theme/themes"
import { useSelector } from "~/store"

const Container = styled.div<{ theme: Theme; hover: boolean }>`
	border-color: ${({ hover, theme }) => (hover ? theme.hover.secondary : theme.secondaryVariant)};
	:hover {
		border-color: ${({ theme }) => theme.hover.secondary};
	}
`

const FileUploader: React.FC = () => {
	const [hover, setHover] = React.useState(false)
	const theme = useSelector(state => state.theme)
	return (
		<div className="flex flex-col cursor-pointer" style={{ width: 300, height: 220 }}>
			<Container
				hover={hover}
				theme={theme}
				className="border-file-uploader"
				onClick={() => dndimages.send()}
				onDragOver={e => e.preventDefault()}
				onDragEnter={e => setHover(true)}
				onDragLeave={e => setHover(false)}
				onDrop={e => {
					e.preventDefault()
					dndimages.send(Array.from(e.dataTransfer.files).map(v => v.path))
					setHover(false)
				}}
			>
				<FontAwesomeIcon className="pointer-events-none" icon={faFileUpload} size="2x" />
			</Container>
		</div>
	)
}

export default FileUploader
