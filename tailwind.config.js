/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                heading: ['Syne', 'sans-serif'],
                body: ['Plus Jakarta Sans', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#eef2ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    900: '#1e1b4b',
                    accent: '#06b6d4',
                }
            }
        },
    },
    plugins: [],
}