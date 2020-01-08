import React from "react"
import styled from "styled-components"
import { Scrollbars } from "react-custom-scrollbars"
import { useSelector } from "~/store"

const CustomThumb = styled.div.attrs(props => ({ ...props }))<{ color: string }>`
    background: ${props => props.color};
    position: relative;
    right: 3px;
    opacity: 0.3;
    border-radius: 3px;
    z-index: 1;
    transition: opacity 0.2s ease-in;
    :hover {
        opacity: 0.8;
    }
`

const CustomScrollBars: React.FC = ({ children }) => {
    const { textColor } = useSelector(state => state.theme)
    return (
        <Scrollbars
            renderThumbVertical={() => <CustomThumb color={textColor} />}
            renderThumbHorizontal={() => <CustomThumb color={textColor} />}
        >
            {children}
        </Scrollbars>
    )
}

export default CustomScrollBars
