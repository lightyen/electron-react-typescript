import React from "react"
import { FormattedMessage } from "react-intl"

import logo from "assets/images/logo.svg"
import Page from "~/components/Page"

import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"
import tw from "twin.macro"

const spin = keyframes`
	to {
		transform: rotate(360deg);
	}
`

const Header = styled.header`
	font-size: calc(10px + 2vmin);
	${tw`flex-auto flex flex-col items-center justify-center`}
`

const Logo = styled.img`
	height: 40vmin;
	animation: ${spin} 60s linear infinite;
	${tw`pointer-events-none`}
`

const Code = styled.code`
	transition: color 200ms ease;
	${tw`text-indigo-500`}
	:hover {
		color: #02dddd;
		${tw`underline`}
	}
`

const HomeLink = styled.a`
	color: #61dafb;
	:hover,
	:focus {
		${tw`underline`}
	}
`

const HomePage = () => {
	return (
		<Page>
			<div tw="flex-auto flex text-center select-none">
				<Header>
					<Logo src={logo} alt="logo" />
					<p css={{ userSelect: "text" }}>
						Edit <Code>renderer/views/Home/index.tsx</Code> and save to reload.
					</p>
					<span css={{ userSelect: "none" }}>
						<FormattedMessage id="d700b" defaultMessage="{name} is awesome!" values={{ name: "React" }} />
					</span>
					<HomeLink href="https://reactjs.org" rel="noopener noreferrer">
						Learn React
					</HomeLink>
				</Header>
			</div>
		</Page>
	)
}

export default HomePage
