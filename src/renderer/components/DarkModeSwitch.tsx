import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun"
import { faMoon } from "@fortawesome/free-solid-svg-icons/faMoon"
import { useSelector, useAction } from "~/store"
import { FormattedMessage } from "react-intl"
import { v4 as uuidv4 } from "uuid"

import styled from "@emotion/styled"
import tw from "twin.macro"

const Switch = styled.div`
	--dm-switch-width: 100px;
	--dm-switch-height: 36px;
	${tw`inline-block relative`}
	width: var(--dm-switch-width);
	height: var(--dm-switch-height);
	> input {
		display: none;
	}
	> label {
		${tw`relative w-full h-full block overflow-hidden select-none`}
		transition: all 200ms ease;
	}
	> label:hover {
		${tw`cursor-pointer`}
		box-shadow: 0 0 3px 4px rgba(110, 190, 255, 0.8);
	}
	> label > div {
		${tw`absolute w-full h-full select-none text-center`}
		line-height: var(--dm-switch-height);
		backface-visibility: hidden;
		transition: transform 300ms ease;
		transform-origin: 0% 200%;
	}
	> label > div > span {
		${tw`pl-2 capitalize`}
	}
	/** checked */
	> label {
		color: rgb(var(--theme-text-surface));
		background: rgb(var(--theme-surface));
	}
	> input:not(:checked) + label > *:first-of-type {
		transform: rotate(0deg);
	}
	> input:checked + label > *:first-of-type {
		transform: rotate(-90deg);
	}
	> input:not(:checked) + label > *:last-child {
		transform: rotate(90deg);
	}
	> input:checked + label > *:last-child {
		transform: rotate(0deg);
	}
`

export default () => {
	const name = useSelector(state => state.theme.name)
	const { changeTheme } = useAction().theme
	const uuid = React.useRef(uuidv4())
	return (
		<Switch>
			<input
				id={uuid.current}
				type="checkbox"
				defaultChecked={name == "dark"}
				onChange={e => changeTheme({ name: e.target.checked ? "dark" : "light", cached: true })}
			/>
			<label htmlFor={uuid.current}>
				<div>
					<FontAwesomeIcon icon={faSun} />
					<span>
						<FormattedMessage id="light" />
					</span>
				</div>
				<div>
					<FontAwesomeIcon icon={faMoon} />
					<span>
						<FormattedMessage id="dark" />
					</span>
				</div>
			</label>
		</Switch>
	)
}
