import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import virtualModule from "./plugins/vite-plugin-example"
import i18n from "./plugins/vite-plugin-i18n"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), virtualModule(), i18n]
})
