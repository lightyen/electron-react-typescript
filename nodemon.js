let restart = false
require("nodemon")({ script: "src/main/dev" })
    .on("exit", () => {
        if (!restart) {
            process.exit()
        }
        restart = false
    })
    .on("restart", () => {
        restart = true
    })
