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
          // Главные цвета
          primary: "#161819",    // Обсидиановый фон
          secondary: "#C89E58",  // Античное тайское золото
          wood: "#4A3320",       // Резное дерево
          dark: "#0F1112",       // Тени и глубокие элементы
          light: "#E3DDD1",      // Цвет крафта/пергамента для текста
          
          // Оттенки для градиентов и эффектов наведения
          gold: {
            50: "#FDF9F1",
            100: "#F6EBD5",
            200: "#E6D0A7",
            300: "#D4B67F",
            400: "#C89E58",
            500: "#A67F3F",
          },
          green: {
            50: "#4D6B53",
            100: "#3A543F",
            200: "#2C4631", // Глубокий Jade из логотипа
            300: "#1E3322",
          },
          parchment: {
            50: "#F8F6F2",
            100: "#EFEBE1",
            200: "#E3DDD1",
            300: "#D1C8B6",
            400: "#BEB19A",
          }
        }
      }
    },
  },
  plugins: [],
}
