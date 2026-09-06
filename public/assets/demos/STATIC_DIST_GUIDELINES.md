# Static Dist Output & Demo Execution Guidelines

To ensure sub-app models and standalone demos load smoothly from `/demos/${folderName}/index.html` without throwing `404 Not Found` errors or asset path resolution failures (e.g., broken `./assets/` JS/CSS bundles, missing favicons, or broken image paths), follow these configuration standards when building sub-projects for local portfolio drop-in.

---

## 1. Vite Configuration Guidelines (`vite.config.ts` / `vite.config.js`)

When building a model app with Vite, the base path must be set to relative (`./`) or the explicit subfolder URL path (`/demos/<folderName>/`).

```typescript
// vite.config.ts inside your standalone model repository
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // IMPORTANT: Ensures assets resolve relative to index.html (./assets/...)
  // preventing 404 errors when served from /demos/<folderName>/
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Generate relative asset paths in output HTML
    modulePreload: {
      polyfill: true,
    },
  },
});
```

---

## 2. Webpack Configuration Guidelines (`webpack.config.js`)

When building a model app using Webpack:

```javascript
// webpack.config.js inside your standalone model repository
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // IMPORTANT: Relative publicPath ensures scripts and styles load from ./
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].[contenthash].js',
    publicPath: './', 
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      // Injects relative script tags (<script src="./assets/main.js">)
      inject: true,
    }),
  ],
};
```

---

## 3. HTML Asset Relative Pathing (`index.html`)

Ensure that all asset links in your `index.html` use relative paths (`./`) instead of absolute root domain paths (`/`):

```html
<!-- ✅ CORRECT: Relative asset paths -->
<link rel="icon" type="image/svg+xml" href="./favicon.svg" />
<link rel="stylesheet" href="./assets/index.css" />
<script type="module" src="./assets/index.js"></script>

<!-- ❌ INCORRECT: Absolute root paths cause 404s when hosted in subfolders -->
<link rel="stylesheet" href="/assets/index.css" />
<script type="module" src="/assets/index.js"></script>
```

---

## 4. Single-Page Application (SPA) Router Configuration

If your model demo uses client-side routing (React Router, Vue Router, etc.), set up hash-based routing or configure the router basename relative to the folder name to prevent 404s on page refresh:

### React Router (Hash Router - Recommended for Static Demos):
```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </HashRouter>
  );
}
```

### React Router (Browser Router with Basename):
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter basename="/demos/my-model">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 5. Local Drop-In Workflow Checklist

To drop a new model into the portfolio:

1. **Build Standalone Model**: Run `npm run build` inside your model project with `base: './'` configured.
2. **Copy Dist Files**: Copy the contents of `dist/` into `public/demos/<folderName>/`:
   ```bash
   mkdir -p public/demos/my-new-model
   cp -r path/to/model/dist/* public/demos/my-new-model/
   ```
3. **Place Preview Image**: Add local preview image directly inside the model folder:
   - `public/demos/my-new-model/my-new-model.webp` (or `.avif`, `.png`, `.jpg`)
4. **Register in Portfolio Configuration**: Append entry to `PROJECTS_CONFIG` in `src/data/projectsConfig.ts`:
   ```typescript
   {
     id: "my-new-model",
     folderName: "my-new-model",
     title: "My New Model Title",
     category: "Websites",
     tags: ["React", "Tailwind"],
     description: "Description of the new model project."
   }
   ```
