import React from "react"
import { IntlProvider } from "react-intl"
import { useTheme, useI18n } from "~/store"
import { motion, Variants, AnimatePresence } from "framer-motion"
import { getLocaleMessages } from "./store/i18n/languages"

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
	const { locale } = useI18n()
	const { background } = useTheme()
	return (
		<div style={{ backgroundColor: background }}>
			<AnimatePresence initial={false}>
				<IntlProvider key={locale} locale={locale} messages={getLocaleMessages(locale)}>
					<motion.div key={locale} variants={variants} initial="initial" animate="in" exit="out">
						{children}
					</motion.div>
				</IntlProvider>
			</AnimatePresence>
		</div>
	)
}

export default LanguageProvider
