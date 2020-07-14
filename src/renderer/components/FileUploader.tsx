import React from "react"
import { dndimages } from "@shared/ipc"
import styled from "@emotion/styled"
import tw from "twin.macro"

const Container = styled(`div`)<{ hover: boolean }>`
	border-color: ${({ hover }) => (hover ? "var(--theme-hover-secondary)" : "var(--theme-secondaryvariant)")};
	:hover {
		border-color: var(--theme-hover-secondary);
	}
	border-width: 5px;
	transition: all 200ms ease;
	${tw`flex flex-grow justify-center items-center m-3 rounded-lg border-dashed`}
`

const FileUploader: React.FC = () => {
	const [hover, setHover] = React.useState(false)
	return (
		<div className="flex flex-col cursor-pointer" style={{ width: 300, height: 220 }}>
			<Container
				hover={hover}
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
				<div className="pointer-events-none">
					<svg
						id="i-import"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 32 32"
						width="32"
						height="32"
						fill="none"
						stroke="currentcolor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					>
						<path d="M28 22 L28 30 4 30 4 22 M16 4 L16 24 M8 16 L16 24 24 16" />
					</svg>
				</div>
			</Container>
		</div>
	)
}

export default FileUploader
