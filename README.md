# Ruiyuan Bai — Portfolio

An interactive portfolio with a particle-name starfield, five project bands and eleven case studies. Images and narrative follow the author's Figma portfolio; game excerpts run directly in the case pages.

## Develop

Requires Node.js 22 or newer. No installation is needed for the checked-in website.

```sh
npm start
```

Open http://127.0.0.1:4173. The source is in `dist/`; `content.json` owns the case-study content. Local routing serves the homepage from `universe.html` and case pages from `index.html`.

Internal project navigation uses the current tab. Case pages start at the top; returning home restores the departing row and scroll position. Source artwork is non-clickable. Animations support reduced motion and game controls support keyboard input.

## Check and build

```sh
npm run check
npm run build -- --base /portfolio
```

`scripts/build-static.mjs` writes `site/`, copies only the current website and its referenced assets, and creates real route directories for every case. `--base /portfolio` supports GitHub Pages; omit it for a domain-root deployment. Do not edit generated `site/` files.

## Publish

The `Publish portfolio` GitHub Actions workflow checks the source, builds for the Pages base path, and deploys the `site/` artifact on pushes to `main`. The same workflow also supports manual dispatch.

Repository: https://github.com/RoiBai/portfolio

### Vercel

Import the repository with its root directory unchanged. The checked-in `vercel.json` selects the **Other** framework, runs `npm run build`, and publishes `site/` as static files at the domain root. `server.mjs` is only the local preview server; production does not need a Node function or `npm start`. GitHub Pages continues to use its separate base-path build above.

## Structure

- `dist/universe.html`, `homepage.*`, `name-hero.*`, `hero-intro.*`: homepage, hover states and particle scene.
- `dist/app.js`, `case-editorial.js`, `case-compositions.js`, `case-simple.css`: case rendering, readable annotations and layered source figures.
- `dist/source-figures.js`: drawing the original source connector paths.
- `dist/data-viz.*`: source-verified numerical charts and animated values.
- `dist/game-experiences.*`: native game excerpts and memorial candles.
- `dist/assets/games-revision/her/`: original selected game component source, local bundle and artwork.
- `dist/verse-interaction.*`: poem blocks and interactive connections.
- `dist/site-paths.js`, `home-position.js`: hosting paths and navigation state.

See [source notes](docs/source-notes.md) for original-material provenance and image-resolution limits. External full games load on demand from the author's game sites.
