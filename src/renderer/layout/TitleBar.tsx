import React from "react"
import Electron from "electron"

import { useSelector, useAction } from "~/store"

import styled from "styled-components"

interface HeaderTitleBarProps {
    height: number
    hide: boolean
    titleBarColor: string
    textTolor: string
}

const HeaderTitleBar = styled.header`
    height: ${(props: HeaderTitleBarProps) => props.height}px;
    line-height: ${(props: HeaderTitleBarProps) => props.height}px;
    display: ${(props: HeaderTitleBarProps) => (props.hide ? "none" : "flex")};
    justify-content: space-between;
    position: relative;
    font-size: 12px;
    background: ${props => props.titleBarColor};
    color: ${(props: HeaderTitleBarProps) => props.textTolor};
`

interface DragRegionProps {
    height: number
}

const DragRegion = styled.div`
    -webkit-app-region: drag;
    width: 100%;
    height: ${(props: DragRegionProps) => props.height - 4}px;
    position: absolute;
    top: 4px;
`

const AppIcon = styled.img`
    display: flex;
    height: 100%;
    padding: 5px;
`

const Title = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: auto;
    margin-right: auto;
`

const Controls = styled.div`
    -webkit-app-region: no-drag;
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: 132px;
`

interface ControlButtonProps {
    hoverColor: string
}

const ControlButton = styled.div`
    width: 44px;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
    &:hover {
        background: ${(props: ControlButtonProps) => props.hoverColor};
    }
`

const TitleBar: React.FC = () => {
    const { remote } = Electron
    function onClose() {
        remote.getCurrentWindow().close()
    }
    function onMinimize() {
        remote.getCurrentWindow().minimize()
    }
    function onMaximize() {
        remote.getCurrentWindow().maximize()
    }
    function onRestore() {
        remote.getCurrentWindow().restore()
    }

    const theme = useSelector(state => state.theme)
    const maximized = useSelector(state => state.app.maximized)
    const icon = useSelector(state => state.app.icon)
    const hide = useSelector(state => state.app.hide)

    return (
        <HeaderTitleBar height={30} hide={hide} titleBarColor={theme.primaryColor} textTolor={theme.textColor}>
            <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
                <DragRegion height={30} />
                {icon && (
                    <div style={{ flexShrink: 0 }}>
                        <AppIcon src={`data:image/png;base64,${icon}`} alt="appicon" />
                    </div>
                )}
                <Title>
                    <span style={{ paddingLeft: 50 }}>{process.env.APP_NAME}</span>
                </Title>
            </div>
            <Controls>
                <ControlButton hoverColor={theme.primaryHoverColor} onClick={onMinimize}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" x="0px" y="0px" viewBox="0 0 10 1">
                        <rect fill={theme.textColor} width="10" height="1" />
                    </svg>
                </ControlButton>
                {maximized ? (
                    <ControlButton hoverColor={theme.primaryHoverColor} onClick={onRestore}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            x="0px"
                            y="0px"
                            viewBox="0 0 10 10"
                        >
                            <mask id="Mask">
                                <rect fill="#ffffff" width="10" height="10" />
                                <path fill="#000000" d="M 3 1 L 9 1 L 9 7 L 8 7 L 8 2 L 3 2 L 3 1 z" />
                                <path fill="#000000" d="M 1 3 L 7 3 L 7 9 L 1 9 L 1 3 z" />
                            </mask>
                            <path
                                fill={theme.textColor}
                                d="M 2 0 L 10 0 L 10 8 L 8 8 L 8 10 L 0 10 L 0 2 L 2 2 L 2 0 z"
                                mask="url(#Mask)"
                            />
                        </svg>
                    </ControlButton>
                ) : (
                    <ControlButton hoverColor={theme.primaryHoverColor} onClick={onMaximize}>
                        <svg
                            fill={theme.textColor}
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                        >
                            <path d="M 0 0 L 0 9.5 L 10 9.5 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 8.5 L 1 8.5 L 1 1 z " />
                        </svg>
                    </ControlButton>
                )}
                <ControlButton hoverColor={theme.dangerColor} onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" x="0px" y="0px" viewBox="0 0 10 10">
                        <polygon fill={theme.textColor} points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
                    </svg>
                </ControlButton>
            </Controls>
        </HeaderTitleBar>
    )
}

export default TitleBar
