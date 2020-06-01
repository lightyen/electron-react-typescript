# Hello

```js
import { IPC } from "@/ipc"

const ipc = new IPC("channel")

// main
ipc.on(function() { return void })
ipc.handle(function(query) { return data })

// renderer
ipc.send(payload)
ipc.invoke(payload, function(data) { return void })
```

```js
const t1 = "channel.pub/sub"
const t2 = "channel.req/res"
```

```js

// main/renderer
import { run } from "helper" // electron-is
run()
```
