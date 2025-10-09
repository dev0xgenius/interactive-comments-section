/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.jsx"],
    theme: {
        extend: {
            colors: {
                blue: {
                    600: "#324152",
                    500: "#67727e",
                    300: "#5457b6",
                    200: "#c3c4ef",
                },

                white: {
                    100: "#ffffff",
                    50: "#eaecf1",
                    80: "#f5f6fa",
                },

                red: {
                    400: "#ffb8bb",
                    100: "#ed6468",
                },
            },
        },
    },

    plugins: [],
};

