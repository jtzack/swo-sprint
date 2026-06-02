/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Midnight backgrounds
        ink: {
          deep: '#10142A',
          900: '#171B38',
          800: '#1C2140',
        },
        // Indigo surfaces (cards on midnight)
        card: {
          DEFAULT: '#222749',
          2: '#2D335D',
          3: '#353B6B',
        },
        line: '#353B6B',
        // Brand accent — Button Red + gradient stops
        red: {
          DEFAULT: '#D31652',
          grad1: '#D31651',
          grad2: '#E84B29',
          grad3: '#FF8203',
        },
        // Text
        fg: {
          DEFAULT: '#FFFFFF',
          1: '#EDEEF6',
          2: '#9B9DB8',
          3: '#6E7196',
          ink: '#161842',
        },
        success: '#3DD68C',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        container: '1180px',
        narrow: '760px',
      },
      backgroundImage: {
        // Signature sunset CTA gradient (red → orange → orange)
        'cta-gradient': 'linear-gradient(95deg, #D31651 0%, #E84B29 45%, #FF8203 100%)',
      },
      boxShadow: {
        cta: '0 10px 30px rgba(211,22,81,0.35)',
        card: '0 8px 30px rgba(0,0,0,0.35)',
        float: '0 24px 60px rgba(0,0,0,0.45)',
      },
      borderRadius: {
        btn: '8px',
        card: '10px',
        lg2: '14px',
      },
      letterSpacing: {
        display: '-0.02em',
        tight2: '-0.015em',
        caps: '0.12em',
      },
    },
  },
  plugins: [],
}
