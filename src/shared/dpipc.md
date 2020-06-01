# Hello

```js
import { createIPC } from "helper"

const ipc = createIPC("channel")

// main
ipc.on(function() { return void })
ipc.handle(function(query) { return data })
ipc.send(function() { return data })
ipc.request(query, function(data) { return void })

// renderer
ipc.send(function() { return data })
ipc.invoke(query, function(data) { return void })
ipc.on(function() { return void })
ipc.response(function(query) { return data })
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
