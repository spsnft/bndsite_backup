/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          // Основные цвета MPS Phuket
          primary: "#233E3F",    // фон, шапка, подвал
          secondary: "#A88444",  // кнопки, акценты, золото
          wood: "#57291E",       // дерево, доп. акцент
          dark: "#352F2C",       // текст на светлом фоне
          light: "#BBB3A6",      // фон карточек, блоков
          
          // Оттенки для градиентов и эффектов
          gold: {
            50: "#E8DBC8",
            100: "#DDBE8C",
            200: "#C49A5B",
            300: "#A88444",
            400: "#8C6E34",
            500: "#6B5328",
          },
          green: {
            50: "#4A6B6D",
            100: "#2C4D4F",
            200: "#233E3F",
            300: "#1A2F30",
          },
          parchment: {
            50: "#F0EBE2",
            100: "#E8E2D6",
            200: "#D4CEC2",
            300: "#BBB3A6",
            400: "#9C9488",
          }
        }
      }
    },
  },
  plugins: [],
}
