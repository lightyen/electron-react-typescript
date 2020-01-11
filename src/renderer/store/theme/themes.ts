export interface Theme {
    primaryColor: string
    primaryHoverColor: string
    dangerColor: string
    textColor: string
    backgroundColor: string
}

export const themes: { [key: string]: Theme } = {
    light: {
        primaryColor: "#f5f6f7",
        primaryHoverColor: "#d3dadf",
        dangerColor: "#e96767",
        textColor: "#3b3b3b",
        backgroundColor: "#fafafa",
    },
    dark: {
        primaryColor: "#1f1f20",
        primaryHoverColor: "#333536",
        dangerColor: "#b13030",
        textColor: "#e2e2e2",
        backgroundColor: "#20232a",
    },
}
