import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun"
import { faMoon } from "@fortawesome/free-solid-svg-icons/faMoon"
import { useTheme, useAction } from "~/store"
import { FormattedMessage } from "react-intl"
import { v4 as uuidv4 } from "uuid"

export default () => {
	const { name } = useTheme()
	const { changeTheme } = useAction().theme
	const uuid = React.useRef(uuidv4())
	return (
		<div className="dm-switch">
			<input
				id={uuid.current}
				type="checkbox"
				className="hidden"
				defaultChecked={name == "dark"}
				onChange={e => changeTheme({ name: e.target.checked ? "dark" : "light", cached: true })}
			/>
			<label htmlFor={uuid.current}>
				<div>
					<FontAwesomeIcon icon={faSun} />
					<span className="pl-1 capitalize">
						<FormattedMessage id="light" />
					</span>
				</div>
				<div>
					<FontAwesomeIcon icon={faMoon} />
					<span className="pl-1 capitalize">
						<FormattedMessage id="dark" />
					</span>
				</div>
			</label>
		</div>
	)
}
