import React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction } from "~/store"

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
    const { updateApp } = useAction().app
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
                    className="fixed bg-gray-700 border-gray-300 text-gray-100 shadow p-3 flex flex-col"
                    style={{ bottom: 13, left: 13 }}
                >
                    <p className="mb-3">
                        <FormattedMessage id="update.available" values={{ version }} />
                    </p>
                    <div>
                        <button className="btn btn-blue select-none" onClick={() => updateApp()}>
                            <FormattedMessage id="update.restart" />
                        </button>
                        <button className="btn btn-blue ml-3 select-none" onClick={() => setOpen(false)}>
                            <FormattedMessage id="update.later" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default AutoUpdater
