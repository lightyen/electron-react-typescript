import React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction } from "~/store/hooks"
import { css } from "@emotion/core"
import tw from "twin.macro"

const variants: Variants = {
	open: {
		y: 0,
	},
	close: {
		y: "130%",
	},
}

const AutoUpdater: React.FC = () => {
	const downloaded = useSelector(state => state.app.update_downloaded)
	const version = useSelector(state => state.app.update_version)
	const { updateAppAndRestart } = useAction().app
	const [isOpen, setOpen] = React.useState(downloaded)
	React.useEffect(() => {
		downloaded && setOpen(downloaded)
	}, [downloaded])

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					variants={variants}
					initial="close"
					animate="open"
					exit="close"
					tw="fixed bg-gray-700 border-gray-300 text-gray-100 shadow p-3 flex flex-col"
					style={{ bottom: 13, left: 13 }}
				>
					<p tw="mb-3">
						<FormattedMessage
							id="98879"
							defaultMessage="New version {version} available."
							values={{ version }}
						/>
					</p>
					<div>
						<button
							tw="select-none"
							css={css`
								${tw`bg-blue-500 text-white`}
								:focus {
									box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
									${tw`outline-none`}
								}
								:hover {
									box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
									${tw`bg-blue-600`}
								}
							`}
							onClick={() => updateAppAndRestart()}
						>
							<FormattedMessage id="6932f" defaultMessage="Restart Now?" />
						</button>
						<button
							tw="ml-3 select-none"
							css={css`
								${tw`bg-blue-500 text-white`}
								:focus {
									box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
									${tw`outline-none`}
								}
								:hover {
									box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
									${tw`bg-blue-600`}
								}
							`}
							onClick={() => setOpen(false)}
						>
							<FormattedMessage id="61057" defaultMessage="Later" />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default AutoUpdater
