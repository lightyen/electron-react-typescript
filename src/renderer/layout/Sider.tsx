import { NavLink } from "react-router-dom"
import { useIntl } from "react-intl"

import styled from "@emotion/styled"
import tw from "twin.macro"

const SiderWrapper = styled.div<{ collapsed?: boolean }>`
	user-select: none;
	min-width: 4rem;
	transition: all 200ms ease;
	background-color: rgb(var(--theme-background));
	${({ collapsed }) => collapsed && tw`-ml-16`}
`

const StyledNavLink = styled(NavLink)`
	${tw`p-3 flex outline-none items-center justify-center relative`}
	transition: all 200ms ease;
	opacity: 0.5;
	svg {
		width: 24px;
	}
	&.active {
		background-color: rgb(var(--theme-active-primary));
		opacity: 0.9;
	}
	&.active::after {
		content: "";
		width: 0.3rem;
		background: rgb(var(--theme-success));
		${tw`h-full absolute left-0`}
	}
	:hover {
		background-color: rgb(var(--theme-hover-primary));
		opacity: 1;
	}
	:focus {
		background-color: rgb(var(--theme-hover-primary));
		box-shadow: inset 0 0 10px rgb(var(--theme-shadow));
		opacity: 1;
	}
`

const Sider = () => {
	// https://github.com/danklammer/bytesize-icons
	const intl = useIntl()
	return (
		<SiderWrapper>
			<StyledNavLink to="/" exact title={intl.formatMessage({ id: "nav_home" })}>
				<svg
					id="i-home"
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
					<path d="M12 20 L12 30 4 30 4 12 16 2 28 12 28 30 20 30 20 20 Z" />
				</svg>
			</StyledNavLink>
			<StyledNavLink to="/settings" title={intl.formatMessage({ id: "nav_settings" })}>
				<svg
					id="i-settings"
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
					<path d="M13 2 L13 6 11 7 8 4 4 8 7 11 6 13 2 13 2 19 6 19 7 21 4 24 8 28 11 25 13 26 13 30 19 30 19 26 21 25 24 28 28 24 25 21 26 19 30 19 30 13 26 13 25 11 28 8 24 4 21 7 19 6 19 2 Z" />
					<circle cx="16" cy="16" r="4" />
				</svg>
			</StyledNavLink>
			<StyledNavLink to="/demo" title="Demo">
				<svg
					id="i-play"
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
					<path d="M10 2 L10 30 24 16 Z" />
				</svg>
			</StyledNavLink>
		</SiderWrapper>
	)
}

export default Sider
