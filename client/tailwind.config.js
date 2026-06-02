/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.jsx"],
    theme: {
        extend: {
            colors: {
                blue: {
                    600: "#2d3f51",
                    500: "#5f6b7a",
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

            boxShadow: {
                card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
                "card-hover":
                    "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
                modal: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)",
                counter: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
            },

            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "scale-in": {
                    "0%": { opacity: "0", transform: "scale(0.96)" },
                    "100%": { opacity: "1", transform: "scale(1)" },
                },
                "slide-down": {
                    "0%": { opacity: "0", transform: "translateY(-8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
            },

            animation: {
                "fade-in": "fade-in 0.3s ease-out",
                "scale-in": "scale-in 0.25s ease-out",
                "slide-down": "slide-down 0.25s ease-out",
                shimmer: "shimmer 1.8s ease-in-out infinite",
            },
        },
    },

    plugins: [],
};

