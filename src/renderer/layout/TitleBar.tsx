import React from "react"
import styled from "styled-components"
import { useSelector } from "~/store"
import { subscribe, SubscribeCallBack, unsubscribe } from "~/ipc"
import icon from "~assets/images/favicon.ico"

const currentWindow = window.electron.currentWindow

interface HeaderTitleBarProps {
    height: number
    hide: boolean
    titleBarColor: string
    textTolor: string
}

const HeaderTitleBar = styled.header`
    position: sticky;
    top: 0;
    height: ${(props: HeaderTitleBarProps) => props.height}px;
    line-height: ${(props: HeaderTitleBarProps) => props.height}px;
    display: ${(props: HeaderTitleBarProps) => (props.hide ? "none" : "flex")};
    justify-content: space-between;
    background: ${props => props.titleBarColor};
    color: ${(props: HeaderTitleBarProps) => props.textTolor};
    transition: all 0.2s ease;
`

interface HeightProps {
    height: number
}

const DragRegion = styled.div`
    -webkit-app-region: drag;
    width: 100%;
    height: ${(props: HeightProps) => props.height - 4}px;
    position: absolute;
    top: 4px;
`

const AppIcon = styled.img`
    display: flex;
    height: 100%;
    padding: 5px;
    user-select: none;
`

const Title = styled.div`
    flex: 1 1 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: ${(props: HeightProps) => (props.height - 4) * 0.5}px;
    transition: font-size 0.2s ease;
    user-select: none;
    zoom: 1;
`

const Controls = styled.div`
    -webkit-app-region: no-drag;
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: ${(props: HeightProps) => (props.height / 30) * 138}px;
    transition: width 0.2s ease;
`

interface ControlButtonProps {
    hoverColor: string
    height: number
}

const ControlButton = styled.div`
    display: flex;
    width: ${(props: ControlButtonProps) => (props.height / 30) * 46}px;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
    &:hover {
        background: ${(props: ControlButtonProps) => props.hoverColor};
    }
    transition: all 0.2s ease;
`

function close() {
    currentWindow.close()
}
function minimize() {
    currentWindow.minimize()
}
function restore() {
    currentWindow.restore()
}
function maximize() {
    currentWindow.maximize()
}

const TitleBar: React.FC = () => {
    const theme = useSelector(state => state.theme)
    const hide = useSelector(state => state.app.hide)
    const [maximized, setMaximized] = React.useState(currentWindow.isMaximized())

    const barHeight = 30
    const iw = barHeight / 3
    const ih = barHeight / 3

    React.useEffect(() => {
        const cb: SubscribeCallBack<boolean> = (_, res) => {
            setMaximized(res.data)
        }
        subscribe("window.maximized", cb)
        return () => unsubscribe("window.maximized", cb)
    }, [])

    return (
        <HeaderTitleBar height={barHeight} hide={hide} titleBarColor={theme.primaryColor} textTolor={theme.textColor}>
            <div style={{ display: "flex", flexGrow: 1, position: "relative" }}>
                <DragRegion height={barHeight} />
                <div style={{ height: barHeight, width: barHeight }}>
                    <AppIcon src={icon} alt="appicon" />
                </div>
                <Title height={barHeight}>
                    <div style={{ flex: "0 0 65px", height: "100%" }}></div>
                    <span>{process.env.APP_NAME}</span>
                </Title>
            </div>
            <Controls height={barHeight}>
                <ControlButton height={barHeight} hoverColor={theme.primaryHoverColor} onClick={minimize}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={iw} height={ih} x="0px" y="0px" viewBox="0 0 10 1">
                        <rect fill={theme.textColor} width="10" height="1" />
                    </svg>
                </ControlButton>
                {maximized ? (
                    <ControlButton height={barHeight} hoverColor={theme.primaryHoverColor} onClick={restore}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={iw}
                            height={ih}
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
                    <ControlButton height={barHeight} hoverColor={theme.primaryHoverColor} onClick={maximize}>
                        <svg
                            fill={theme.textColor}
                            xmlns="http://www.w3.org/2000/svg"
                            width={iw}
                            height={ih}
                            viewBox="0 0 10 10"
                        >
                            <path d="M 0 0 L 0 9.5 L 10 9.5 L 10 0 L 0 0 z M 1 1 L 9 1 L 9 8.5 L 1 8.5 L 1 1 z " />
                        </svg>
                    </ControlButton>
                )}
                <ControlButton height={barHeight} hoverColor={theme.dangerColor} onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={iw} height={ih} x="0px" y="0px" viewBox="0 0 10 10">
                        <polygon fill={theme.textColor} points="10,1 9,0 5,4 1,0 0,1 4,5 0,9 1,10 5,6 9,10 10,9 6,5" />
                    </svg>
                </ControlButton>
            </Controls>
        </HeaderTitleBar>
    )
}

export default TitleBar
