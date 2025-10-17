import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Esta es la parte crucial.
  // Le dice a Vite: "Cuando compiles la aplicación, busca en el código 'process.env.API_KEY'
  // y reemplázalo por el valor real de la variable API_KEY que te da el entorno (Netlify)".
  // JSON.stringify() asegura que se inserte como una cadena de texto.
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
})