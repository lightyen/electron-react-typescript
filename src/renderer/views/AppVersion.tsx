import React from "react"
import styled from "styled-components"
import { FormattedMessage } from "react-intl"
import { useSelector, useAction } from "~/store"

const Versions = styled.div`
    font-family: Fira Code;
    background: #eeeeee;
    color: #000000;
    text-align: center;
`

const Table = styled.table`
    width: 100%;
`

const THead = styled.thead`
    height: 20px;
    text-align: center;
`

const TBody = styled.tbody`
    background: #e7e7e7;
`

interface Versions {
    electron: string
    node: string
    chrome: string
}

const AppVersion: React.FC = () => {
    const version = useSelector(state => state.app.version)
    const { getVersion } = useAction().app
    React.useEffect(() => {
        getVersion()
    }, [getVersion])
    return (
        <Versions className="select-text">
            <h1 className="font-bold" style={{ textTransform: "capitalize", fontSize: "1.5em" }}>
                <FormattedMessage id="version" /> =>
            </h1>
            <Table>
                <THead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                    </tr>
                </THead>
                <TBody>
                    <tr>
                        <td>Version</td>
                        <td>{version.app}</td>
                    </tr>
                    <tr>
                        <td>Electron</td>
                        <td>{version.electron}</td>
                    </tr>
                    <tr>
                        <td>NodeJS</td>
                        <td>{version.node}</td>
                    </tr>
                    <tr>
                        <td>Chrome</td>
                        <td>{version.chrome}</td>
                    </tr>
                    <tr>
                        <td>{version.os.name}</td>
                        <td>{version.os.version}</td>
                    </tr>
                </TBody>
            </Table>
        </Versions>
    )
}

export default AppVersion
