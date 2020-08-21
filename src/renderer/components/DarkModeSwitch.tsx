import React from "react"
import styled from "@emotion/styled"
import tw from "twin.macro"
import { useSelector, useAction } from "~/store/hooks"
import { FormattedMessage } from "react-intl"
import { v4 as uuidv4 } from "uuid"
import Sun24 from "@carbon/icons-react/lib/sun/24"
import Moon24 from "@carbon/icons-react/lib/moon/24"

const Switch = styled.div`
	--dm-switch-width: 100px;
	--dm-switch-height: 36px;
	${tw`inline-block relative`}
	width: var(--dm-switch-width);
	height: var(--dm-switch-height);
`

const __Label = styled.label`
	${tw`relative w-full h-full block overflow-hidden select-none`}
	transition: all 200ms ease;
	:hover {
		${tw`cursor-pointer`}
		box-shadow: 0 0 3px 4px rgba(110, 190, 255, 0.8);
	}
	> div {
		${tw`absolute w-full h-full select-none text-center flex items-center justify-center`}
		backface-visibility: hidden;
		transition: transform 300ms ease;
		transform-origin: 0% 200%;
	}
	> div > span {
		${tw`pl-2 capitalize`}
	}
	> div > svg {
		display: inline-block;
	}
	color: rgb(var(--theme-text-surface));
	background: rgb(var(--theme-surface));
`

const __Input = styled.input`
	display: none;

	:not(:checked) + ${__Label} > *:first-of-type {
		transform: rotate(0deg);
	}
	:checked + ${__Label} > *:first-of-type {
		transform: rotate(-90deg);
	}
	:not(:checked) + ${__Label} > *:last-child {
		transform: rotate(90deg);
	}
	:checked + ${__Label} > *:last-child {
		transform: rotate(0deg);
	}
`

const DarkModeSwitch = () => {
	const name = useSelector(state => state.theme.name)
	const { changeTheme } = useAction().theme
	const uuid = React.useRef(uuidv4())
	return (
		<Switch>
			<__Input
				id={uuid.current}
				type="checkbox"
				defaultChecked={name == "dark"}
				onChange={e => changeTheme({ name: e.target.checked ? "dark" : "light", cached: true })}
			/>
			<__Label htmlFor={uuid.current}>
				<div>
					<Sun24 />
					<span>
						<FormattedMessage id="light" />
					</span>
				</div>
				<div>
					<Moon24 />
					<span>
						<FormattedMessage id="dark" />
					</span>
				</div>
			</__Label>
		</Switch>
	)
}

export default DarkModeSwitch
