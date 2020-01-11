import React from "react"
import styled from "styled-components"
import { useSelector } from "~/store"

interface ScrollBarProps {
    /** Color with scrollbar thumb, ex: #cccccc */
    color?: string
    /** The width of scrollbar thumb */
    width?: number
    padding?: number
}

// https://css-tricks.com/custom-scrollbars-in-webkit/
const ScrollBar = styled.div.attrs(props => ({ width: 8, padding: 6, color: "black", ...props }))<ScrollBarProps>`
    color: transparent;
    transition: color 0.6s ease;
    text-shadow: 0 0 black;
    overflow: auto;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;

    &::-webkit-scrollbar {
        width: ${({ width, padding }) => width + padding * 2}px;
        height: ${({ width, padding }) => width + padding * 2}px;
    }

    &::-webkit-scrollbar-track {
        display: none;
    }

    &:hover {
        color: ${({ color }) => color}80;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: ${({ width, padding }) => width / 2 + padding}px;
        border: ${({ padding }) => padding}px solid transparent;
        box-shadow: inset 0 0 0 100px;
    }
`

const CustomScrollBar: React.FC = ({ children }) => {
    const color = useSelector(state => state.theme.textColor)
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <ScrollBar color={color}>{children}</ScrollBar>
        </div>
    )
}
export default CustomScrollBar
