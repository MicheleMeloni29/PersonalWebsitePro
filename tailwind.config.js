const { Slide } = require("@mui/material");

module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // colori personalizzati per il tema chiaro e scuro
                'dark_border_img': 'red-800',
                'light-border_img': 'red-900', 
                'dark_icon': 'white', // colore per le icone nel tema scuro
                'light_icon': 'red-700', // colore per le icone nel tema chiaro
                
                // corrispondono a bg-light-background e bg-dark-background
                'light-background': '#F5F5F5',  
                'dark-background': '#0D0D0D',  
            },
            // se vuoi un gradiente di background usalo così:
            backgroundImage: {
                'page-light': 'linear-gradient(135deg, #F5F5F5, #E0E0E0)',
                'page-dark': 'linear-gradient(135deg, #0D0D0D, #111111)',
              },
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
  