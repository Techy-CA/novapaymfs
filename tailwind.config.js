/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f1f5f9', secondary: '#ffffff',
          card: '#ffffff', card2: '#f8fafc', elevated: '#f1f5f9',
        },
        slate: {
          50:'#f8fafc',100:'#f1f5f9',200:'#e2e8f0',300:'#cbd5e1',
          400:'#94a3b8',500:'#64748b',600:'#475569',700:'#334155',
          800:'#1e293b',900:'#0f172a',
        },
        blue: { 50:'#eff6ff',100:'#dbeafe',200:'#bfdbfe',400:'#60a5fa',500:'#3b82f6',600:'#2563eb',700:'#1d4ed8',800:'#1e40af' },
        emerald: { 50:'#ecfdf5',100:'#d1fae5',400:'#34d399',500:'#10b981',600:'#059669',700:'#047857' },
        rose: { 50:'#fff1f2',100:'#ffe4e6',400:'#fb7185',500:'#f43f5e',600:'#e11d48',700:'#dc2626' },
        amber: { 50:'#fffbeb',100:'#fef3c7',400:'#fbbf24',500:'#f59e0b',600:'#d97706',700:'#b45309' },
        violet: { 50:'#f5f3ff',100:'#ede9fe',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed',700:'#6d28d9' },
        teal: { 50:'#f0fdfa',100:'#ccfbf1',400:'#2dd4bf',500:'#14b8a6',600:'#0d9488',700:'#0f766e' },
      },
      fontFamily: { sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'] },
      boxShadow: {
        sm: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        DEFAULT: '0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)',
        md: '0 4px 6px -1px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)',
        lg: '0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px rgba(15,23,42,0.04)',
        xl: '0 20px 25px -5px rgba(15,23,42,0.10), 0 10px 10px rgba(15,23,42,0.04)',
        card: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        focus: '0 0 0 3px rgba(37,99,235,0.14)',
        modal: '0 25px 50px -12px rgba(15,23,42,0.20)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s cubic-bezier(0.4,0,0.2,1)',
        'pulse-slow': 'pulse 2.8s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity:'0', transform:'translateY(4px)' }, to: { opacity:'1', transform:'translateY(0)' } },
      },
    },
  },
  plugins: [],
};