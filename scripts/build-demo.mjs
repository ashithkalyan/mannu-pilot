import { build } from 'esbuild'; import fs from 'node:fs';
const out = await build({ entryPoints: ['web/app.mjs'], bundle: true, format: 'iife', platform: 'browser', write: false, minify: false, target: 'es2020' });
const js = out.outputFiles[0].text.replaceAll('</script', '<\\/script');
let html = fs.readFileSync('web/index.html', 'utf8').replace('<link rel="manifest" href="manifest.json">', '').replace('<script type="module" src="app.mjs"></script>', () => `<script>\n${js}\n</script>`);
fs.mkdirSync('dist', { recursive: true }); fs.writeFileSync('dist/mannu-demo.html', html); console.log('dist/mannu-demo.html', Math.round(html.length / 1024) + ' KB');
