import React from "react"
import { useAction, useI18n } from "~/store"
import { supports } from "~/store/i18n/languages"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage"

import styled from "@emotion/styled"
import { css } from "@emotion/core"
import tw from "twin.macro"

const Dropdown = styled.div`
	--lc-dropdown-control-width: 130px;
	--lc-dropdown-control-height: 36px;
	${tw`relative inline-flex`}
`

const DropdownControl = styled.button`
	color: rgb(var(--theme-text-surface));
	background: rgb(var(--theme-surface));
	width: var(--lc-dropdown-control-width);
	height: var(--lc-dropdown-control-height);
	transition: all 200ms ease;
	text-align: center;
	text-align-last: center;
	${tw`relative inline-flex outline-none appearance-none capitalize select-none`}
	${tw`justify-center items-center`}
	:focus {
		${tw`outline-none`}
	}
	:hover {
		box-shadow: 0 0 3px 4px rgba(110, 190, 255, 0.8);
	}
	> span {
		${tw`pl-2`}
	}
`
const DropdownMenuCaret = styled.div`
	position: absolute;
	width: 1rem;
	height: 1rem;
	top: -1rem;
	left: 0.8rem;
	transition: background-color 200ms ease;
	clip-path: polygon(50% 20%, 0% 100%, 100% 100%);
	background-color: rgb(var(--theme-surface));
`

const DropdownMenu = styled.ul`
	top: calc(100% + 0.5rem);
	left: 3rem;
	z-index: inherit;
	min-width: var(--lc-dropdown-control-width);
	filter: drop-shadow(1px 1px 2px rgba(var(--theme-shadow)))
		drop-shadow(1px 1px 2px rgba(var(--theme-shadow-ambient)));
	${tw`absolute right-0 mt-2`}

	> li {
		color: rgb(var(--theme-text-surface));
		transition: all 200ms ease;
		margin-top: -1px;
		${tw`px-4 py-2 cursor-pointer select-none`}
	}
	> li:hover {
		background-color: rgb(var(--theme-hover-surface));
	}
	> li:first-of-type:hover ~ ${DropdownMenuCaret} {
		background-color: rgb(var(--theme-hover-surface));
	}
`

export default () => {
	const { setLocale } = useAction().i18n
	const { locale } = useI18n()

	const btn = React.useRef<HTMLButtonElement>()
	const ul = React.useRef<HTMLUListElement>()
	const [open, setOpen] = React.useState(false)

	React.useEffect(() => {
		const button = btn.current
		const menu = ul.current
		function onMouseDown(e: MouseEvent) {
			if (open && !menu.contains(e.target as Node) && !button.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		window.addEventListener("mousedown", onMouseDown)
		return () => window.removeEventListener("mousedown", onMouseDown)
	}, [open])
	console.log(locale, Object.entries(supports))
	return (
		<Dropdown>
			<DropdownControl ref={btn} onMouseDown={() => setOpen(!open)}>
				<FontAwesomeIcon icon={faLanguage} />
				<span>{supports[locale]}</span>
			</DropdownControl>
			{open && (
				<DropdownMenu ref={ul}>
					{Object.entries(supports).map(([k, v]) => (
						<li
							key={k}
							css={
								locale === k
									? css`
											background: rgb(var(--theme-active-surface));
									  `
									: css`
											background: rgb(var(--theme-surface));
									  `
							}
							onClick={() => setLocale({ locale: k, cached: true })}
						>
							{v}
						</li>
					))}
					<DropdownMenuCaret
						css={
							locale === Object.keys(supports)[0] &&
							css`
								background: rgb(var(--theme-active-surface));
							`
						}
					/>
				</DropdownMenu>
			)}
		</Dropdown>
	)
}
