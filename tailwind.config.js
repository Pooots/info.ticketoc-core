/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          black: {
            DEFAULT: '#000000',
            card: '#0c0c0c',
            elevated: '#141414',
            border: '#1f1f1f',
          },
        },
        animation: {
          'fade-in': 'fadeIn 0.6s ease-out forwards',
          'fade-in-delay': 'fadeIn 0.8s ease-out 0.2s both',
          'fade-in-delay-2': 'fadeIn 1s ease-out 0.4s both',
          'slide-up': 'slideUp 0.8s ease-out forwards',
          'slide-up-delay': 'slideUp 0.8s ease-out 0.15s both',
          'scale-in': 'scaleIn 0.5s ease-out forwards',
          'blob': 'blob 7s infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
          'float': 'float 4s ease-in-out infinite',
          'shimmer': 'shimmer 2s linear infinite',
          'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
          'card-glow': 'cardGlow 2.5s ease-in-out infinite',
          'gradient-shift': 'gradientShift 8s ease infinite',
          'float-slow': 'floatSlow 6s ease-in-out infinite',
          'glow-pulse': 'glowPulse 3s ease-in-out infinite',
          'border-glow': 'borderGlow 2.5s ease-in-out infinite',
          'particle-float': 'particleFloat 20s linear infinite',
          'shimmer-slow': 'shimmerSlow 4s ease-in-out infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          slideUp: {
            '0%': { opacity: '0', transform: 'translateY(40px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          scaleIn: {
            '0%': { opacity: '0', transform: 'scale(0.95)' },
            '100%': { opacity: '1', transform: 'scale(1)' },
          },
          blob: {
            '0%': { transform: 'translate(0px, 0px) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0px, 0px) scale(1)' },
          },
          glow: {
            '0%': { opacity: '0.4', filter: 'brightness(1)' },
            '100%': { opacity: '0.8', filter: 'brightness(1.2)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
          scrollBounce: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(6px)' },
          },
          cardGlow: {
            '0%, 100%': { boxShadow: '0 0 0 0 rgba(251, 191, 36, 0)' },
            '50%': { boxShadow: '0 0 30px 2px rgba(251, 191, 36, 0.15)' },
          },
          gradientShift: {
            '0%, 100%': { opacity: '0.5', transform: 'scale(1) translate(0, 0)' },
            '33%': { opacity: '0.7', transform: 'scale(1.1) translate(2%, -2%)' },
            '66%': { opacity: '0.6', transform: 'scale(0.95) translate(-1%, 1%)' },
          },
          floatSlow: {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '25%': { transform: 'translateY(-8px) translateX(4px)' },
            '50%': { transform: 'translateY(-4px) translateX(-6px)' },
            '75%': { transform: 'translateY(-12px) translateX(2px)' },
          },
          glowPulse: {
            '0%, 100%': { opacity: '0.6', filter: 'blur(60px)' },
            '50%': { opacity: '1', filter: 'blur(80px)' },
          },
          borderGlow: {
            '0%, 100%': { opacity: '0.5' },
            '50%': { opacity: '1' },
          },
          particleFloat: {
            '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
            '10%': { opacity: '0.4' },
            '90%': { opacity: '0.4' },
            '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: '0' },
          },
          shimmerSlow: {
            '0%': { backgroundPosition: '-100% 0' },
            '100%': { backgroundPosition: '200% 0' },
          },
        },
        boxShadow: {
          'card-hover': '0 0 40px -5px rgba(251, 191, 36, 0.2)',
        },
      },
    },
    plugins: [],
  }