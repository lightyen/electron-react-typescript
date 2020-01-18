declare module "*.png"
declare module "*.jpg"
declare module "*.svg"
declare module "*.css"
declare module "*.less"
declare module "*.json"

declare module "~/tailwind.config.js" {
    export interface TailwindcssConfig {
        prefix: string
        important: boolean
        separator: string
        theme: {
            screens: {
                sm: string
                md: string
                lg: string
                xl: string
            }
            colors: {
                transparent: string
                black: string
                white: string

                gray: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                red: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                orange: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                yellow: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                green: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                teal: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                blue: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                indigo: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                purple: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                pink: {
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                }
                darkslateblue: {
                    50: string
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                    A100: string
                    A200: string
                    A400: string
                    A700: string
                }
                darkslategray: {
                    50: string
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                    A100: string
                    A200: string
                    A400: string
                    A700: string
                }
                stategray: {
                    50: string
                    100: string
                    200: string
                    300: string
                    400: string
                    500: string
                    600: string
                    700: string
                    800: string
                    900: string
                    A100: string
                    A200: string
                    A400: string
                    A700: string
                }
            }
            spacing: {
                px: string
                "0": string
                "1": string
                "2": string
                "3": string
                "4": string
                "5": string
                "6": string
                "8": string
                "10": string
                "12": string
                "16": string
                "20": string
                "24": string
                "32": string
                "40": string
                "48": string
                "56": string
                "64": string
            }
            backgroundPosition: {
                bottom: string
                center: string
                left: string
                "left-bottom": string
                "left-top": string
                right: string
                "right-bottom": string
                "right-top": string
                top: string
            }
            backgroundSize: {
                auto: string
                cover: string
                contain: string
            }
            borderRadius: {
                none: string
                sm: string
                default: string
                lg: string
                full: string
            }
            borderWidth: {
                default: string
                "0": string
                "2": string
                "4": string
                "8": string
            }
            boxShadow: {
                default: string
                md: string
                lg: string
                xl: string
                "2xl": string
                inner: string
                outline: string
                none: string
            }
            container: {}
            cursor: {
                auto: string
                default: string
                pointer: string
                wait: string
                text: string
                move: string
                "not-allowed": string
            }
            fill: {
                current: string
            }
            flex: {
                "1": string
                auto: string
                initial: string
                none: string
            }
            flexGrow: {
                "0": string
                default: string
            }
            flexShrink: {
                "0": string
                default: string
            }
            fontFamily: {
                sans: [
                    "-apple-system",
                    "BlinkMacSystemFont",
                    '"Segoe UI"',
                    "Roboto",
                    '"Helvetica Neue"',
                    "Arial",
                    '"Noto Sans"',
                    "sans-serif",
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ]
                serif: string[]
                mono: string[]
            }
            fontSize: {
                xs: string
                sm: string
                base: string
                lg: string
                xl: string
                "2xl": string
                "3xl": string
                "4xl": string
                "5xl": string
                "6xl": string
            }
            fontWeight: {
                hairline: string
                thin: string
                light: string
                normal: string
                medium: string
                semibold: string
                bold: string
                extrabold: string
                black: string
            }
            inset: {
                "0": string
                auto: string
            }
            letterSpacing: {
                tighter: string
                tight: string
                normal: string
                wide: string
                wider: string
                widest: string
            }
            lineHeight: {
                none: string
                tight: string
                snug: string
                normal: string
                relaxed: string
                loose: string
            }
            listStyleType: {
                none: string
                disc: string
                decimal: string
            }
            maxHeight: {
                full: string
                screen: string
            }
            maxWidth: {
                xs: string
                sm: string
                md: string
                lg: string
                xl: string
                "2xl": string
                "3xl": string
                "4xl": string
                "5xl": string
                "6xl": string
                full: string
            }
            minHeight: {
                "0": string
                full: string
                screen: string
            }
            minWidth: {
                "0": string
                full: string
            }
            objectPosition: {
                bottom: string
                center: string
                left: string
                "left-bottom": string
                "left-top": string
                right: string
                "right-bottom": string
                "right-top": string
                top: string
            }
            opacity: {
                "0": string
                "25": string
                "50": string
                "75": string
                "100": string
            }
            order: {
                first: string
                last: string
                none: string
                "1": string
                "2": string
                "3": string
                "4": string
                "5": string
                "6": string
                "7": string
                "8": string
                "9": string
                "10": string
                "11": string
                "12": string
            }
            stroke: {
                current: string
            }
            zIndex: {
                auto: string
                "0": string
                "10": string
                "20": string
                "30": string
                "40": string
                "50": string
            }
        }
        variants: {
            accessibility: string[]
            alignContent: string[]
            alignItems: string[]
            alignSelf: string[]
            appearance: string[]
            backgroundAttachment: string[]
            backgroundColor: string[]
            backgroundPosition: string[]
            backgroundRepeat: string[]
            backgroundSize: string[]
            borderCollapse: string[]
            borderColor: string[]
            borderRadius: string[]
            borderStyle: string[]
            borderWidth: string[]
            boxShadow: string[]
            cursor: string[]
            display: string[]
            fill: string[]
            flex: string[]
            flexDirection: string[]
            flexGrow: string[]
            flexShrink: string[]
            flexWrap: string[]
            float: string[]
            fontFamily: string[]
            fontSize: string[]
            fontSmoothing: string[]
            fontStyle: string[]
            fontWeight: string[]
            height: string[]
            inset: string[]
            justifyContent: string[]
            letterSpacing: string[]
            lineHeight: string[]
            listStylePosition: string[]
            listStyleType: string[]
            margin: string[]
            maxHeight: string[]
            maxWidth: string[]
            minHeight: string[]
            minWidth: string[]
            objectFit: string[]
            objectPosition: string[]
            opacity: string[]
            order: string[]
            outline: string[]
            overflow: string[]
            padding: string[]
            placeholderColor: string[]
            pointerEvents: string[]
            position: string[]
            resize: string[]
            stroke: string[]
            tableLayout: string[]
            textAlign: string[]
            textColor: string[]
            textDecoration: string[]
            textTransform: string[]
            userSelect: string[]
            verticalAlign: string[]
            visibility: string[]
            whitespace: string[]
            width: string[]
            wordBreak: string[]
            zIndex: string[]
        }
    }

    const config: TailwindcssConfig
    export default config
}
