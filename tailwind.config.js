const { Slide } = require("@mui/material");

module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            scrollBehavior: ['responsive'],
            keyframes: {
                slideInUp: {
                    '0%': { transform: 'translateY(100%)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideOutUp: {
                    '0%': { transform: 'translateY(0)', opacity: '1' },
                    '100%': { transform: 'translateY(-100%)', opacity: '0' },
                },
                slideDown: {
                    "0%": { opacity: 0, transform: "translateX(100%)" },
                    "100%": { opacity: 1, transform: "translateX(0)" },
                },
            },
            animation: {
                slideInUp: 'slideInUp 0.5s ease-out forwards',
                slideOutUp: 'slideOutUp 0.5s ease-in forwards',
                slideDown: 'slideDown 0.4s ease-out forwards'
            },
        },
    },
    plugins: [],
}
  