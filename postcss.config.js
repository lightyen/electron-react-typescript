module.exports = {
  plugins: [
    require("postcss-import"),
    require("tailwindcss")("./src/renderer/tailwind.config.js"),
    require("autoprefixer"),
  ],
}
