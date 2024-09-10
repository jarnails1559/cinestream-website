/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
	  './pages/**/*.{js,ts,jsx,tsx,mdx}',
	  './components/**/*.{js,ts,jsx,tsx,mdx}',
	  './app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
	  extend: {
		colors: {
		  primary: 'var(--primary)',
		  'primary-dark': 'var(--primary-dark)',
		},
		animation: {
		  'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
		},
	  },
	},
	plugins: [],
	darkMode: 'class',
}