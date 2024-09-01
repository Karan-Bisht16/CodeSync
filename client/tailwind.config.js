/** @type {import("tailwindcss").Config} */

import { theme } from "./src/constants/Themes";

module.exports = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}"
    ],
    theme: theme,
    plugins: [],
};