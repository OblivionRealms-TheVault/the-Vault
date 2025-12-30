import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pages URL: https://OblivionRealms-TheVault.github.io/the-Vault/
// base should be '/the-Vault/' so asset URLs are correct on GitHub Pages.
export default defineConfig({
  base: '/the-Vault/',
  plugins: [react()],
})
