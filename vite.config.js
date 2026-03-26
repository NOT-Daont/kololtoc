import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base URL pro GitHub Pages – změň 'kololtoc' na název svého repozitáře!
  base: '/kololtoc/',
})
