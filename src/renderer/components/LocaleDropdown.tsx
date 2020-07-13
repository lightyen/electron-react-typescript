import React from "react"
import { useAction, useI18n } from "~/store"
import { supports } from "~/store/i18n/languages"
import { motion, AnimatePresence } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLanguage } from "@fortawesome/free-solid-svg-icons/faLanguage"

export default () => {
	const { setLocale } = useAction().i18n
	const { locale } = useI18n()

	const [open, setOpen] = React.useState(false)
	const button = React.useRef<HTMLButtonElement>()
	const ul = React.useRef<HTMLUListElement>()

	React.useEffect(() => {
		const btn = button.current
		const menu = ul.current
		function onMouseDown(e: MouseEvent) {
			if (open && !menu.contains(e.target as Node) && !btn.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		window.addEventListener("mousedown", onMouseDown)
		return () => window.removeEventListener("mousedown", onMouseDown)
	}, [open])

	return (
		<div className="lc-dropdown">
			<button className="lc-dropdown-control" ref={button} onClick={() => setOpen(true)}>
				<FontAwesomeIcon icon={faLanguage} />
				<span className="pl-2">{supports[locale]}</span>
			</button>
			<AnimatePresence>
				{open && (
					<motion.ul
						ref={ul}
						className="lc-dropdown-menu"
						initial={{ opacity: 0, scaleY: 0.2, translateY: -30 }}
						animate={{
							opacity: 1,
							scaleY: 1,
							translateY: 0,
							transition: { ease: "linear", duration: 0.05 },
						}}
						exit={{
							opacity: 0,
							scaleY: 0.2,
							translateY: -30,
							transition: { ease: "linear", duration: 0.05 },
						}}
					>
						{Object.entries(supports).map(([locale, value]) => (
							<li key={locale} onClick={() => setLocale({ locale, cached: true })}>
								{value}
							</li>
						))}
					</motion.ul>
				)}
			</AnimatePresence>
		</div>
	)
}
