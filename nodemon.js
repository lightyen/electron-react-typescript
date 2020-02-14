let exit = true
require("nodemon")({ script: "src/main/dev" })
    .on("exit", function() {
        exit && this.emit("quit")
        exit = true
    })
    .on("restart", () => {
        exit = false
    })
    .on("quit", () => {
        process.exit()
    })
