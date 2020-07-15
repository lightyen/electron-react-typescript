import React from "react"
import classnames from "classnames"
import { useScollBarVisible } from "./ScrollBar"

import tw, { styled } from "twin.macro"

interface Props {
	className?: string
}

const Container = styled.div`
	${tw`m-3 px-3`}
	color: rgb(var(--theme-text-background));
	background-color: rgb(var(--theme-background));
`

const Page: React.FC<Props> = ({ children, className }) => {
	const visible = useScollBarVisible()
	return <Container className={classnames({ "mr-1": visible }, className)}>{children}</Container>
}

export default Page
