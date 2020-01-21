import React from "react"
import styled from "styled-components"
import { useSelector, useAction } from "~/store"

const Header = styled.h1``

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
        <Versions>
            <Header>Versions</Header>
            <Table>
                <THead>
                    <tr>
                        <th>Name</th>
                        <th>Number</th>
                    </tr>
                </THead>
                <TBody>
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
