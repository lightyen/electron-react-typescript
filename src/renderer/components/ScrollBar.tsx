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
    overflow-x: hidden;
    overflow-y: scroll;

    box-sizing: border-box;
    height: calc(100vh - 30px);

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

export const ScrollBarContext = React.createContext<HTMLDivElement>(null)

export function useScrollBarTarget() {
    return React.useContext(ScrollBarContext)
}

// const CustomScrollBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
//     ({ children, ...rest }, ref) => {
//         const color = useSelector(state => state.theme.textColor)
//         const iRef = React.useRef<HTMLDivElement>()
//         return (
//             <ScrollBar ref={ref || iRef} color={color} {...rest}>
//                 <ScrollBarContext.Provider value={ref || iRef.current}>{children}</ScrollBarContext.Provider>
//             </ScrollBar>
//         )
//     },
// )

const CustomScrollBar: React.FC = ({ children, ...rest }) => {
    const color = useSelector(state => state.theme.textColor)
    const ref = React.useRef<HTMLDivElement>()
    const [target, setTarget] = React.useState<HTMLDivElement>(ref.current)
    React.useEffect(() => {
        setTarget(ref.current)
    }, [])

    return (
        <ScrollBar ref={ref} color={color} {...rest}>
            {target && <ScrollBarContext.Provider value={target}>{children}</ScrollBarContext.Provider>}
        </ScrollBar>
    )
}

CustomScrollBar.displayName = "CustomScrollBar"
export default CustomScrollBar
