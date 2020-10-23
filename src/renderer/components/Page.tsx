import React from "react"
import { useScollBarVisible } from "./ScrollBar"

import tw, { styled } from "twin.macro"

import type { InterpolationWithTheme } from "@emotion/core"
interface Props {
	css?: InterpolationWithTheme<unknown>
}

const Container = styled.div<{ hasScrollbar: boolean }>`
	${tw`m-3 px-3`}
	color: rgb(var(--theme-text-background));
	background-color: rgb(var(--theme-background));
	${({ hasScrollbar }) => hasScrollbar && tw`mr-1`}
`

const Page = ({ children, css }: React.PropsWithChildren<Props>) => {
	const visible = useScollBarVisible()
	return (
		<Container hasScrollbar={visible} css={css}>
			{children}
		</Container>
	)
}

export default Page
