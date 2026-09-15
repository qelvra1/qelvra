# QELVRA — Static Asset Management

All static assets live **exclusively in `/public`**, organized into categorized
subfolders and served as-is at the site root. Nothing binary is imported from
`/src` — the source tree stays code-only, and every reference uses an absolute
public URL (`/logos/…`, `/favicons/…`, `/images/…`, `/demos/…`).

---

## 1. Directory Layout

```
public/
├── favicons/                      # App + device icons, PWA manifest
│   ├── site.webmanifest           # ✅ Shipped — PWA manifest (raster icons)
│   ├── favicon.png                # ⬇ Drop-in: 32×32 primary tab icon
│   ├── favicon.ico                # ⬇ Drop-in: legacy multi-size icon
│   ├── apple-touch-icon.png       # ⬇ Drop-in: 180×180 iOS home-screen icon
│   ├── icon-192.png               # ⬇ Drop-in: 192×192 Android / PWA
│   └── icon-512.png               # ⬇ Drop-in: 512×512 PWA splash / store
│
├── logos/                         # Brand marks (raster only)
│   └── qelvra-logo.png            # ⬇ Drop-in: horizontal wordmark (og:image)
│
├── images/                        # General UI graphics, textures, backgrounds (drop-ins)
│
├── demos/                         # Compiled static showcase builds
│   └── <folderName>/              # lowercase slug (oak-blade, lumiere-haven…)
│       ├── index.html             # compiled demo entry
│       ├── assets/                # compiled demo css/js
│       │   └── app.css
│       └── <Exact Display Name>.[ext]   # preview — exact professional name
│
└── ASSETS_README.md               # this file
```

displayName → folderName mapping:

| displayName                          | folderName          |
| ------------------------------------ | ------------------- |
| OAK & BLADE — Barbering Atelier      | `oak-blade`         |
| Velocity Rental Car                  | `velocity`          |
| CripsyLand Fast food                 | `cripsyland`        |
| Medicare Health Clinic               | `medicare`          |
| Peak Performannce Fitness            | `peak-performannce` |
| Lumière Haven · Hotel & Resort       | `lumiere-haven`     |
| ARCHETYPE — Private Estates          | `archetype`         |
| AURELIA FINE DINING                  | `aurelia`           |
| NEXORA MARKETPLACE                   | `nexora`            |

---

## 2. Referencing Assets in Code

Always use absolute public URLs — never `import` static files from `/src`:

```ts
// ✅ Correct — absolute public URLs, raster formats only
const logo = "/logos/qelvra-logo.png";
const icon = "/favicons/favicon.png";
const bg   = "/images/<name>.webp";      // any general graphic you drop in
const shot = `/demos/${modelName}/preview.webp`;

// ❌ Wrong — couples the bundle to the asset and breaks the public scheme
import logo from "../assets/logo.png";
```

The universal resolver (`src/utils/assets.ts`) builds demo paths for you:

```ts
import { demoIndexUrl, previewCandidates, getAssetPath } from "@/utils/assets";

demoIndexUrl("lumiere-haven");
// "/demos/lumiere-haven/index.html"

previewCandidates("oak-blade", "OAK & BLADE — Barbering Atelier");
// ["/demos/oak-blade/OAK%20%26%20BLADE%20%E2%80%94%20Barbering%20Atelier.avif", … .jpeg]

getAssetPath("logos", "qelvra-logo", "png");   // "/logos/qelvra-logo.png"
```

---

## 3. Favicons & Device Icons

The head tags and manifest already point at raster paths — drop the PNGs into
`public/favicons/` using **these exact names** and they render immediately:

```html
<link rel="icon" type="image/png" href="/favicons/favicon.png" />
<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
<link rel="manifest" href="/favicons/site.webmanifest" />
```

| File                   | Dimensions | Notes                             |
| ---------------------- | ---------- | --------------------------------- |
| `favicon.png`          | 32×32      | primary tab icon                  |
| `favicon.ico`          | 32×32      | embed 16×16 layer for legacy tabs |
| `apple-touch-icon.png` | 180×180    | opaque `#00060E`, no alpha        |
| `icon-192.png`         | 192×192    | PWA launcher                      |
| `icon-512.png`         | 512×512    | PWA splash + store listing        |

---

## 4. Project Preview Images

Selected Works reads its catalog from `src/data/projects.ts`. Each model has a
**lowercase `folderName`** (filesystem) and an **exact professional
`displayName`** (UI + preview filename). Routing and preview detection are
separate concerns:

```
index.html  → /demos/<folderName>/index.html
preview     → /demos/<folderName>/<Exact Display Name>.avif → .webp → .png → .jpg → .jpeg
```

`<SmartImage />` probes the display-name file inside the model folder first,
then falls back to a configured remote image, then a branded monogram — the
layout never breaks.

The raster probe order is exactly:

```
.avif → .webp → .png → .jpg → .jpeg
```

| Property     | Value                                                       |
| ------------ | ----------------------------------------------------------- |
| Path         | `public/demos/<folderName>/<Exact Display Name>.<ext>`      |
| Aspect ratio | **16 : 10** — exact card frame (`aspect-[16/10]`, `object-cover object-top`) |
| Dimensions   | **1200 × 750 px** (min 800 × 500)                           |
| Formats      | `avif` / `webp` / `png` / `jpg` / `jpeg` — probed in that order |
| Weight       | ≤ 250 KB; export at quality 78–82                           |

### Manual workflow for a new model

1. Copy the compiled build into the slug folder:

   ```bash
   mkdir -p public/demos/my-model && cp -r dist/index.html dist/assets public/demos/my-model/
   ```

2. Add the preview under the exact display name:

   ```bash
   cp shot.webp "public/demos/my-model/My Model — Display Name.webp"
   ```

3. Append one entry to `src/data/projects.ts`. No UI component changes — the
   resolver detects the folder, the display-name preview and its extension
   automatically.

---

## 5. Logos & General Images

- `logos/` holds brand marks only (raster). `qelvra-logo.png` doubles as the
  `og:image`. Keep a clear-space margin equal to the Q-ring diameter when reusing.
- `images/` holds decorative/UI graphics (textures, placeholders, backgrounds).
  Reference via plain URL or CSS `url("/images/…")`.

---

## 6. Rules of the Road

- **Never** import images from `/src` — public assets stay cacheable and
  replaceable without rebuilds.
- Keep demo **builds** (`index.html` + `assets/`) and their **preview** in the
  same `<modelName>` folder.
- Previews should be real captures of the compiled demo where possible — they
  double as QA that the demo still renders.
- Favicon PNGs must be opaque on `#00060E`; transparent iOS icons get rounded
  against black.
