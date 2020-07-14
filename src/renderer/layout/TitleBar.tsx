import React from "react"
import { useSelector, useAction } from "~/store"
import icon from "assets/images/favicon.ico"
import { useIntl } from "react-intl"

import styled from "styled-components"
import tw from "twin.macro"

const Titlebar = styled.header`
	--control-panel-width: (var(--control-ratio) * 138px);
	--icon-size: (var(--control-ratio) * 10px);
	height: calc(var(--titlebar-height));
	line-height: calc(var(--titlebar-height));
	${tw`flex justify-between`}
	transition: all 0.15s ease;
	color: var(--theme-text-primary);
	background: var(--theme-titlebar-background);
`

const DragRegion = styled.div`
	-webkit-app-region: drag;
	width: 100%;
	height: calc(var(--titlebar-height) - 4px);
	position: absolute;
	top: 4px;
`

const AppIcon = styled.div`
	display: flex;
	width: calc(var(--titlebar-height));
	height: calc(var(--titlebar-height));
	padding: 5px;
	user-select: none;
`

const Text = styled.div`
	${tw`flex-auto flex justify-center items-center overflow-hidden whitespace-no-wrap select-none`}
	text-overflow: ellipsis;
	font-size: calc((var(--titlebar-height) - 4px) * 0.5);
	transition: all ease 0.15s;
	zoom: 1;
`

const Padding = styled.div`
	flex: 0 0 calc((var(--titlebar-height) + var(--control-panel-width)) / 2);
`

const ControlPanel = styled.div`
	${tw`flex justify-between text-center`}
	-webkit-app-region: no-drag;
	transition: all ease 0.15s;
	width: calc(var(--control-panel-width));
`

const Control = styled.div`
	${tw`flex justify-center items-center select-none`}
	width: calc(var(--control-panel-width) / 2);
	opacity: 0.8;
	transition: all 0.15s ease;
	color: var(--theme-text-primary);
	svg {
		fill: var(--theme-text-primary);
		width: calc(var(--icon-size));
		height: calc(var(--icon-size));
	}
	:hover {
		opacity: 1;
		background: var(--theme-hover-primary);
	}
	:hover.quit {
		opacity: 1;
		background: var(--theme-error);
	}
`

export default () => {
	const maximized = useSelector(state => state.app.maximized)
	const { window_close, window_maximize, window_minimize, window_restore } = useAction().app
	const intl = useIntl()
	return (
		<Titlebar>
			<div className="relative flex flex-auto">
				<DragRegion />
				<AppIcon>
					<img src={icon} alt="appicon" />
				</AppIcon>
				<Text>
					<Padding />
					<span>{process.env.APP_NAME}</span>
				</Text>
			</div>
			<ControlPanel>
				<Control onClick={window_minimize} title={intl.formatMessage({ id: "app_minimize" })}>
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 1.5">
						<rect width="10" height="1.5" />
					</svg>
				</Control>
				{maximized ? (
					<Control onClick={window_restore} title={intl.formatMessage({ id: "app_restore" })}>
						<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
							<mask id="Mask">
								<rect fill="#ffffff" width="10" height="10" />
								<path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
								<path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
							</mask>
							<path d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z" mask="url(#Mask)" />
						</svg>
					</Control>
				) : (
					<Control onClick={window_maximize} title={intl.formatMessage({ id: "app_maximize" })}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
							<path d="M 0 0 L 0 9.5 L 10 9.5 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 8.5 L 1 8.5 L 1 1 z " />
						</svg>
					</Control>
				)}
				<Control className="quit" onClick={window_close} title={intl.formatMessage({ id: "app_quit" })}>
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
						<polygon points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
					</svg>
				</Control>
			</ControlPanel>
		</Titlebar>
	)
}
