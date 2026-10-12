import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';

// Public assets stay public URLs. Never bundle image contents into JavaScript.
export function showcaseImages(): Plugin {
  const moduleId = 'virtual:showcase-images';
  const resolvedId = '\0' + moduleId;
  let publicDir = '';
  const groups = [
    { exportName: 'designImages', directory: 'PORFOLIO DESIGNS', category: 'Design showcase' },
    { exportName: 'brandImages', directory: 'GRAPHICS AND BRAND DESIGN', category: 'Graphics & brand design' },
  ];
  return {
    name: 'local-showcase-images',
    configResolved(config) { publicDir = config.publicDir; },
    resolveId(id) { if (id === moduleId) return resolvedId; },
    load(id) {
      if (id !== resolvedId) return;
      return groups.map(group => {
        const root = path.join(publicDir, group.directory);
        const scan = (directory: string): string[] => fs.existsSync(directory)
          ? fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
            ? scan(path.join(directory, entry.name))
            : /\.(avif|webp|png|jpe?g|gif|svg)$/i.test(entry.name) ? [path.join(directory, entry.name)] : [])
          : [];
        let files = scan(root);
        // Existing upload contains a few clearly named graphics alongside UI screens.
        const graphics = /flyer|feature graphics/i;
        if (group.exportName === 'brandImages' && files.length === 0) files = scan(path.join(publicDir, 'PORFOLIO DESIGNS')).filter(file => graphics.test(path.basename(file)));
        if (group.exportName === 'designImages') files = files.filter(file => !graphics.test(path.basename(file)) && !/^DAVID\./i.test(path.basename(file)));
        const seen = new Set<string>();
        files = files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).filter(file => {
          const hash = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
          if (seen.has(hash)) return false;
          seen.add(hash); return true;
        });
        // Start with a mix of project families, then retain every remaining image.
        const featured = ['1 (1).png', 'Landing Page.png', 'DEV AND DESIGN LABS (11).jpg', 'Homepage.png', 'iPad Pro 12.9_ - 2.png', 'Frame 2147227873.png'];
        files.sort((a, b) => {
          const ai = featured.indexOf(path.basename(a)), bi = featured.indexOf(path.basename(b));
          return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
        });
        const title = (file: string) => {
          const name = path.basename(file, path.extname(file));
          if (/^screencapture-ai-empowerment/i.test(name)) {
            const page = name.match(/vercel-app-(.*?)-2026/)?.[1];
            return `AI Empowerment Foundation${page ? ' / ' + page.replace(/-/g, ' ') : ''}`;
          }
          if (/^\d+( \(\d+\))?$/.test(name)) return `OctoServe / Interface study ${name}`;
          if (/^DEV AND DESIGN LABS/i.test(name)) return name.replace(/DEV AND DESIGN LABS/i, 'Dev & Design Labs');
          return name.replace(/[-_]/g, ' ');
        };
        const images = files.map(file => ({
          src: '/' + path.relative(publicDir, file).split(path.sep).map(encodeURIComponent).join('/'),
          preview: fs.existsSync(path.join(publicDir, 'showcase-previews', path.basename(file) + '.webp')) ? '/showcase-previews/' + encodeURIComponent(path.basename(file) + '.webp') : undefined,
          title: title(file),
          category: group.category,
        }));
        return `export const ${group.exportName} = ${JSON.stringify(images)};`;
      }).join('\n');
    },
    configureServer(server) {
      const roots = groups.map(group => path.join(publicDir, group.directory));
      server.watcher.add(roots);
      const refresh = (file: string) => {
        if (!roots.some(root => file.startsWith(root + path.sep))) return;
        const mod = server.moduleGraph.getModuleById(resolvedId);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', refresh).on('unlink', refresh).on('change', refresh);
    },
  };
}
