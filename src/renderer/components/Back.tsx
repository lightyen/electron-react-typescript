import React from "react"
import { useHistory } from "react-router-dom"
import classnames from "classnames"
import styled from "styled-components"
import { useTheme } from "~/store"

interface BackProps {
	to?: string
	className?: string
}

interface HoverProps {
	color: string
	hoverColor: string
}

const HoverButton = styled.button.attrs(props => ({ ...props }))<HoverProps>`
	color: ${({ color }) => color};
	transition: color 0.16s ease;
	:hover {
		color: ${({ hoverColor }) => hoverColor};
	}
`

const HoverSvg = styled.svg.attrs(props => ({ ...props }))<HoverProps>`
	fill: ${({ color }) => color};
	transition: fill 0.16s ease;
	:hover {
		fill: ${({ hoverColor }) => hoverColor};
	}
`

const Button: React.FC<BackProps> = ({ to, className }) => {
	const {
		text: { surface: color },
		hover: { surface: hoverColor },
	} = useTheme()

	const history = useHistory()
	return (
		<HoverButton
			onClick={() => {
				if (to) {
					history.push(to)
				} else {
					history.goBack()
				}
			}}
			className={classnames("font-bold py-2 px-4 rounded focus:outline-none flex", className)}
			{...{ color, hoverColor }}
		>
			<HoverSvg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				className="mr-1"
				{...{ color, hoverColor }}
			>
				<path d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z" />
			</HoverSvg>
		</HoverButton>
	)
}

export default Button
