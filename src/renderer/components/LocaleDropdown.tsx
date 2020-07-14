import React from "react"
import { useAction, useI18n } from "~/store"
import { supports } from "~/store/i18n/languages"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage"

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

	return (
		<div className="lc-dropdown">
			<button className="lc-dropdown-control" ref={btn} onMouseDown={() => setOpen(!open)}>
				<FontAwesomeIcon icon={faLanguage} />
				<span className="pl-2">{supports[locale]}</span>
			</button>
			{open && (
				<ul ref={ul} className="lc-dropdown-menu">
					{Object.entries(supports).map(([k, v]) => (
						<li
							key={k}
							className={locale == k ? "selected" : ""}
							onClick={() => setLocale({ locale: k, cached: true })}
						>
							{v}
						</li>
					))}
					<div className="lc-dropdown-menu-caret" />
				</ul>
			)}
		</div>
	)
}
