const colors = {
    "primary-accent": {
        "50": "#FDF7FF",
        "100": "#FAF0FF",
        "200": "#F2D9FF",
        "300": "#E5BFFF",
        "400": "#CA91FF",
        "500": "#A762FF",
        "600": "#8D4EE6",
        "700": "#6A36BF",
        "800": "#4C2399",
        "900": "#321473",
        "950": "#1B084A"
    },
    "primary-bg": "#1c1e29",
    "secondary-bg": "#2f363b",
    "tertiary-bg": "#22292F",
    "board-bg": "#282a36",
    "card-bg": "#29343D",

};

const fontFamily = {
    jost: ["Jost"],
    monospace: ["Inconsolata"],
    blinker: ["Blinker"],
    blackOpsOne: ["Black Ops One",]
};

const theme = {
    extend: {
        colors: colors,
    },
    fontFamily: fontFamily,
};

const userThemes = [
    "#b91c1c", "#ea580c", "#f59e0b", "#84cc16", "#16a34a",
    "#14b8a6", "#0891b2", "#0369a1", "#1e3a8a", "#312e81",
    "#6d28d9", "#7e22ce", "#86198f", "#9d174d", "#f43f5e",
    "#e11d48", "#64748b", "#d946ef", "#365314", "#831843",
];

export { theme, colors, fontFamily, userThemes };