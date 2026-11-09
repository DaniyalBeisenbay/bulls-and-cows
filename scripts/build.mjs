import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('dist', { recursive: true });
for (const file of ['index.html', 'styles.css'])
  copyFileSync(file, `dist/${file}`);
