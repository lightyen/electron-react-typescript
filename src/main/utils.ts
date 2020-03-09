import { Stream } from "stream"

export function recvStream(stream: Stream, cb?: (len: number) => void): Promise<Buffer> {
    const bufs: Buffer[] = []
    return new Promise<Buffer>((resolve, reject) => {
        stream.on("error", err => reject(err))
        stream.on("end", () => resolve(Buffer.concat(bufs)))
        stream.on("data", (chunk: Buffer) => {
            bufs.push(chunk)
            cb && cb(chunk.length)
        })
    })
}
