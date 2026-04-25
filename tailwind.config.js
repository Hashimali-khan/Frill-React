/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* Colors */
      colors: {
        /* ── Brand Palette (from original HTML :root) ── */
        purple: {
          DEFAULT: '#3B1F5E',
          mid: '#5A3087',
          light: '#7C4BAD',
        },
        magenta: {
          DEFAULT: '#C2185B',
          hot: '#E91E8C',
        },
        cream: '#FAF9FC',
        brand: {
          primary: '#3B1F5E',
          secondary: '#C2185B',
          bg: '#FAF9FC',
          border: '#E5DEF2',
        },
        frill: {
          50: '#F8F7FB',
          100: '#F0EBF8',
          200: '#DDD5F0',
          400: '#9E8FBB',
          600: '#5D5070',
          800: '#2D1F45',
        },
      },

      /* Font families (generates utilities like `font-head`, `font-body`) */
      fontFamily: {
        head: ['Montserrat', 'sans-serif'],
        serif: ['Lora', 'serif'],
        body: ['Inter', 'sans-serif'],
        nastaliq: ['Noto Nastaliq Urdu', 'serif'],
      },

      borderRadius: {
        frill: '8px',
        'frill-lg': '16px',
      },

      boxShadow: {
        'frill-sm': '0 1px 3px rgba(59,31,94,.08),0 1px 2px rgba(59,31,94,.06)',
        'frill-md': '0 4px 16px rgba(59,31,94,.12),0 2px 6px rgba(59,31,94,.08)',
        'frill-lg': '0 10px 40px rgba(59,31,94,.15),0 4px 12px rgba(59,31,94,.1)',
        'frill-xl': '0 20px 60px rgba(59,31,94,.2)',
      },

      maxWidth: {
        frill: '1200px',
      },

      screens: {
        xs: '375px',
      },

      animation: {
        marquee: 'marquee 20s linear infinite',
        'float-y': 'floatY 3.5s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s infinite',
        'fade-in-up': 'fadeInUp .4s ease both',
        'slide-in-right': 'slideInRight .35s cubic-bezier(.4,0,.2,1) both',
      },

      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        floatY: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.4', transform: 'scale(1.6)' } },
        fadeInUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        slideInRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'none' } },
      },
    },
  },
  plugins: [],
};