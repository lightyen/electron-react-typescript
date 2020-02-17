import Electron, { net, BrowserWindow, ExtensionInfo } from "electron"
import fs from "fs"
import path from "path"
import { promisify } from "util"
import semver from "semver"

import unzip from "./unzip-crx"

const writeFile = promisify(fs.writeFile)
const rmdir = promisify(fs.rmdir)
const unlink = promisify(fs.unlink)
const exists = promisify(fs.exists)

interface ExtensionReference {
    id: string
    electron: string
}

function downloadFile(from: string, to: string) {
    return new Promise<void>((resolve, reject) => {
        const req = net.request(from)
        req.on("response", response => {
            // Shouldn't handle redirect with `electron.net`, this is for https.get fallback
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const headers = (response.headers as any) as Record<string, string>
            if (response.statusCode >= 300 && response.statusCode < 400 && headers.location) {
                downloadFile(headers.location, to)
                    .then(resolve)
                    .catch(reject)
                return
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stream = (response as any) as NodeJS.ReadableStream
            stream.pipe(fs.createWriteStream(to)).on("close", resolve)
            return
        })
        req.on("error", reject)
        req.end()
    })
}

const changePermissions = (dir: string, mode: number) => {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
        const filePath = path.join(dir, file)
        fs.chmodSync(filePath, mode)
        if (fs.statSync(filePath).isDirectory()) {
            changePermissions(filePath, mode)
        }
    })
}

export const EMBER_INSPECTOR: ExtensionReference = {
    id: "bmdblncegkenkacieihfhpjfppoconhi",
    electron: ">=2.0.0",
}
export const REACT_DEVELOPER_TOOLS: ExtensionReference = {
    id: "fmkadmapgofadopljbjfkapdkoienihi",
    electron: ">=2.0.0",
}
export const BACKBONE_DEBUGGER: ExtensionReference = {
    id: "bhljhndlimiafopmmhjlgfpnnchjjbhd",
    electron: ">=2.0.0",
}
export const JQUERY_DEBUGGER: ExtensionReference = {
    id: "dbhhnnnpaeobfddmlalhnehgclcmjimi",
    electron: ">=2.0.0",
}
export const ANGULARJS_BATARANG: ExtensionReference = {
    id: "ighdmehidhipcmcojjgiloacoafjmpfk",
    electron: ">=2.0.0",
}
export const VUEJS_DEVTOOLS: ExtensionReference = {
    id: "nhdogjmejiglipccpnnnanhbledajbpd",
    electron: ">=2.0.0",
}
export const REDUX_DEVTOOLS: ExtensionReference = {
    id: "lmhkpmbekcpmknklioeibfkpmmfibljd",
    electron: ">=2.0.0",
}
export const REACT_PERF: ExtensionReference = {
    id: "hacmcodfllhbnekmghgdlplbdnahmhmm",
    electron: ">2.0.0",
}
export const CYCLEJS_DEVTOOL: ExtensionReference = {
    id: "dfgplfmhhmdekalbpejekgfegkonjpfp",
    electron: ">=2.0.0",
}
export const APOLLO_DEVELOPER_TOOLS: ExtensionReference = {
    id: "jdkknkkbebbapilgoeccciglkfbmbnfm",
    electron: ">=2.0.0",
}
export const MOBX_DEVTOOLS: ExtensionReference = {
    id: "pfgnfdagidkfgccljigdamigbcnndkod",
    electron: ">=2.0.0",
}

type ID = string
type Name = string
let extensionNames: Record<ID, Name> = {}
const extensionsPath = path.resolve(Electron.app.getPath("userData"), "extensions")
const NamesPath = path.join(extensionsPath, "IDMap.json")

if (fs.existsSync(NamesPath)) {
    try {
        extensionNames = JSON.parse(fs.readFileSync(NamesPath, "utf8"))
    } catch (err) {
        throw new Error("electron-devtools-installer: Invalid JSON present in the IDMap file")
    }
}

function downloadChromeExtension(chromeStoreID: string, extensionFolder: string, attempts = 5): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const fileURL = `https://clients2.google.com/service/update2/crx?response=redirect&x=id%3D${chromeStoreID}%26uc&prodversion=32`
        const filePath = path.resolve(`${extensionFolder}.crx`)
        downloadFile(fileURL, filePath)
            .then(() => {
                unzip(filePath, extensionFolder)
                    .then(() => {
                        changePermissions(extensionFolder, 0o755)
                        promisify(fs.unlink)(filePath).then(resolve)
                    })
                    .catch(err => {
                        if (!fs.existsSync(path.resolve(extensionFolder, "manifest.json"))) {
                            return reject(err)
                        }
                    })
            })
            .catch(err => {
                if (attempts <= 1) {
                    return reject(err)
                }
                setTimeout(() => {
                    downloadChromeExtension(chromeStoreID, extensionFolder, attempts - 1)
                        .then(resolve)
                        .catch(reject)
                }, 200)
            })
    })
}

export async function install(extensionReference: ExtensionReference, forceDownload?: boolean): Promise<ExtensionInfo> {
    const chromeStoreID: string = extensionReference.id
    const electronVersion = process.versions.electron.split("-")[0]
    if (!semver.satisfies(electronVersion, extensionReference.electron)) {
        throw new Error(
            `Version of Electron: ${electronVersion} does not match required range ${extensionReference.electron} for extension ${chromeStoreID}`,
        )
    }

    const extensionName = extensionNames[chromeStoreID]
    const devtoolsExts = BrowserWindow.getDevToolsExtensions()
    const extensionInstalled = !!extensionName && !!devtoolsExts[extensionName]
    if (!forceDownload && extensionInstalled) {
        return devtoolsExts[extensionName]
    }

    if (!fs.existsSync(extensionsPath)) {
        fs.mkdirSync(extensionsPath)
    }
    const extensionFolder = path.resolve(`${extensionsPath}/${chromeStoreID}`)
    if (fs.existsSync(extensionFolder)) {
        fs.rmdirSync(extensionFolder, { recursive: true })
    }

    await downloadChromeExtension(chromeStoreID, extensionFolder)

    if (extensionInstalled) {
        BrowserWindow.removeDevToolsExtension(extensionName)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const name = (BrowserWindow.addDevToolsExtension(extensionFolder) as any) as string
    extensionNames[chromeStoreID] = name
    await writeFile(NamesPath, JSON.stringify(extensionNames))
    return BrowserWindow.getDevToolsExtensions()[name]
}

export async function uninstall(extensionReference: ExtensionReference) {
    const name = extensionNames[extensionReference.id]
    if (name) {
        delete extensionNames[extensionReference.id]
        BrowserWindow.removeDevToolsExtension(name)
        await rmdir(path.join(extensionsPath, extensionReference.id), { recursive: true })
    }

    if (Object.keys(extensionNames).length == 0) {
        if (await exists(NamesPath)) {
            await unlink(NamesPath)
        }
    } else {
        await writeFile(NamesPath, JSON.stringify(extensionNames))
    }
}
