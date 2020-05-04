import React from "react"
import { IntlProvider } from "react-intl"
import { useSelector } from "~/store"
import { motion, Variants, AnimatePresence } from "framer-motion"

const variants: Variants = {
	initial: {
		opacity: 0,
	},
	in: {
		opacity: 1,
		transition: { duration: 1, easings: "linear" },
	},
	out: {
		opacity: 0,
		transition: { duration: 0.1 },
	},
}

const LanguageProvider: React.FC = ({ children }) => {
	const name = useSelector(state => state.i18n.name)
	const messages = useSelector(state => state.i18n.messages)
	const backgroundColor = useSelector(state => state.theme.backgroundColor)
	return (
		/* eslint-disable @typescript-eslint/no-explicit-any */
		<div style={{ backgroundColor }}>
			<AnimatePresence initial={false}>
				<IntlProvider locale={name} key={name} messages={messages as any}>
					<motion.div key={name} variants={variants} initial="initial" animate="in" exit="out">
						{children}
					</motion.div>
				</IntlProvider>
			</AnimatePresence>
		</div>
		/* eslint-enable @typescript-eslint/no-explicit-any */
	)
}

export default LanguageProvider
