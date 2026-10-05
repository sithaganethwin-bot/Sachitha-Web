import fs from 'fs';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const removeModuleType = (): Plugin => ({
  name: 'remove-module-type',
  closeBundle() {
    const file = resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      content = content.replace(/<script\s+type="module"\s+crossorigin>/gi, '<script>');
      content = content.replace(/<script\s+crossorigin\s+type="module">/gi, '<script>');
      content = content.replace(/<script>[\s\S]*?When opened directly as a local file[\s\S]*?<\/script>/gi, '');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully patched dist/index.html to remove type=module for 100% file:// compatibility!');
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), removeModuleType()],
  base: './',
});
