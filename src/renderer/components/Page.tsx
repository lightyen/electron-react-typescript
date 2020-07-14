import React from "react"
import classnames from "classnames"
import { useScollBarVisible } from "./ScrollBar"

interface Props {
	className?: string
}

const Page: React.FC<Props> = ({ children, className }) => {
	const visible = useScollBarVisible()
	return <div className={classnames("page", { "mr-1": visible }, className)}>{children}</div>
}

export default Page
