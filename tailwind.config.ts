import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { snow: 'var(--snow)', pine: 'var(--pine)', dusk: 'var(--dusk)', ember: 'var(--ember)', mist: 'var(--mist)' } } }, plugins: [] } satisfies Config;
