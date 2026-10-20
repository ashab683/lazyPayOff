/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lazy: {
          bg: '#FAF7F2',
          card: '#FFFFFF',
          sand: '#EFE8DE',
          sandDark: '#DDD4C4',
          border: '#E8DFD3',
          green: {
            DEFAULT: '#3B6E4A',
            light: '#EAF3EC',
            hover: '#315C3D',
            dark: '#264A31'
          },
          orange: {
            DEFAULT: '#D9682C',
            light: '#FCF1EB',
            hover: '#C25820'
          },
          brown: {
            DEFAULT: '#46382E',
            deep: '#2F251E',
            light: '#6E5D4F'
          },
          muted: '#85776A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(70, 56, 46, 0.04), 0 8px 30px rgba(70, 56, 46, 0.04)',
        'lift': '0 10px 25px -5px rgba(70, 56, 46, 0.08), 0 8px 10px -6px rgba(70, 56, 46, 0.04)',
      }
    },
  },
  plugins: [],
}
