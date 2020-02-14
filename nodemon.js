let exit = true
require("nodemon")({ script: "src/main/dev" })
    .on("exit", () => {
        exit && process.exit()
        exit = true
    })
    .on("restart", () => {
        exit = false
    })
