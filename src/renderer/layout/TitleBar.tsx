import React from "react"
import { useSelector, useAction } from "~/store"
import icon from "assets/images/favicon.ico"
import { useIntl } from "react-intl"

const TitleBar: React.FC = () => {
	const maximized = useSelector(state => state.app.maximized)
	const { window_close, window_maximize, window_minimize, window_restore } = useAction().app
	const intl = useIntl()
	return (
		<header className="titlebar">
			<div className="titlebar-content">
				<div className="titlebar-drag-region" />
				<div className="titlebar-appicon">
					<img src={icon} alt="appicon" />
				</div>
				<div className="titlebar-text">
					<div className="titlebar-text-padding-left" />
					<span>{process.env.APP_NAME}</span>
				</div>
			</div>
			<div className="titlebar-controls">
				<div
					className="titlebar-control-btn"
					onClick={window_minimize}
					title={intl.formatMessage({ id: "app_minimize" })}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="titlebar-control-btn-icon"
						x="0px"
						y="0px"
						viewBox="0 0 10 1.5"
					>
						<rect width="10" height="1.5" />
					</svg>
				</div>
				{maximized ? (
					<div
						className="titlebar-control-btn"
						onClick={window_restore}
						title={intl.formatMessage({ id: "app_restore" })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="titlebar-control-btn-icon"
							x="0px"
							y="0px"
							viewBox="0 0 10 10"
						>
							<mask id="Mask">
								<rect fill="#ffffff" width="10" height="10" />
								<path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
								<path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
							</mask>
							<path d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)" />
						</svg>
					</div>
				) : (
					<div
						className="titlebar-control-btn"
						onClick={window_maximize}
						title={intl.formatMessage({ id: "app_maximize" })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="titlebar-control-btn-icon"
							viewBox="0 0 10 10"
						>
							<path d="M 0 0 L 0 9.5 L 10 9.5 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 8.5 L 1 8.5 L 1 1 z " />
						</svg>
					</div>
				)}
				<div
					className="titlebar-control-btn quit"
					onClick={window_close}
					title={intl.formatMessage({ id: "app_quit" })}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="titlebar-control-btn-icon"
						x="0px"
						y="0px"
						viewBox="0 0 10 10"
					>
						<polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
					</svg>
				</div>
			</div>
		</header>
	)
}

export default TitleBar
