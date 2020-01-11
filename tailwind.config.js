module.exports = {
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [
        require("tailwindcss-transforms")(),
        require("tailwindcss-transitions")(),
        require("tailwindcss-border-gradients")(),
    ],
}
