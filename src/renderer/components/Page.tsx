import React from "react"
import { useTheme } from "~/store"
import classnames from "classnames"
import { useScollBarVisible } from "./ScrollBar"

interface Props {
	className?: string
}

const Page: React.FC<Props> = ({ children, className }) => {
	const {
		background: backgroundColor,
		text: { background: color },
	} = useTheme()
	const visible = useScollBarVisible()
	return (
		<div className={classnames("m-3 px-3", { "mr-1": visible }, className)} style={{ backgroundColor, color }}>
			{children}
		</div>
	)
}

export default Page
