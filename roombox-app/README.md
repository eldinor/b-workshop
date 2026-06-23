# Workshop Roombox

A standalone Vite, TypeScript, and Babylon application for rebuilding the workshop as an open-front roombox.

## Commands

```sh
npm install
npm run dev
npm run build
```

## Asset policy

Place assets owned by this app under `public/assets`. Do not import files from the parent project's `public` directory. This keeps the folder portable so it can later become a separate repository without changing asset URLs.

Existing workshop models are copied selectively during the composition phase. Migrated models retain the original catalog order, transform values, and GLB node-processing path. Ceiling, corridor, door, and duplicate-fridge assets remain excluded.
