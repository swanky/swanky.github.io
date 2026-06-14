# CLAUDE.md

Jekyll portfolio for Swanky Studio (史旺基工作室) on GitHub Pages. Deep structure & design context live in `docs/` — see Reference.

## Working Style

Execute autonomously; start without asking. Read relevant code first; make reasonable assumptions and proceed. Do the full job (edit, test, build); prefer the smallest maintainable diff. No mid-task check-ins unless the action would delete data, modify production config, push to a remote, or touch secrets. Report once at the end: files changed + why, test/build results, remaining risks.

## Development Commands

- `bundle install` — install dependencies
- `bundle exec jekyll serve` — local dev at http://127.0.0.1:4000 (add `--drafts` for _drafts/)
- `bundle exec jekyll build` — build to _site/
- `npm test` — Human Design engine tests (`node --test tests/human-design/*.test.mjs`)
- Deploy is automatic — GitHub Pages rebuilds on push to `master`.

## Constraints

- **Language**: all site copy MUST be Traditional Chinese (zh-TW).
- **Asset paths**: always `{{ '/path' | relative_url }}`.
- **RWA**: always write 「現實世界資產」 (never 真實世界資產); keep the RWA acronym + English term.
- **Two 熊熊 — never confuse**: 吳暐榕 = 制服模特兒; 卓毓彤 = 一線藝人.
- **Don't** put Jekyll front matter in `nft/` files (separate mini-site, excluded from Jekyll).
- **Don't** hand-edit vendored libs in `assets/vendor/`.
- **gstack skills**: after completing a visual / Human-Design-engine / perf change, *offer* the matching skill (don't run unprompted) — see `docs/gstack-skills.md`.

## Known Gotchas

- **Isotope + `loading="lazy"`**: omit lazy on Isotope grid pages — collapses layout (Isotope runs before image dims known).
- **Flickr URLs**: local copies `{photo_id}_{secret}_{size}.jpeg`; photo links `https://www.flickr.com/photos/swanky-hsiao/{photo_id}/`.
- **`.gstack` / `.playwright-mcp` artifacts**: dev-tool output triggers watch-regenerate and can break local styling until a full `jekyll build` (already excluded in `_config.yml`).
- **Vendored astronomy-engine**: browser loads `astronomy.browser.min.js` as a classic script (global `Astronomy`) before the ES module; Node tests load it via `createRequire()` because `assets/vendor/astronomy-engine/package.json` sets `"type":"commonjs"`, overriding the repo-root `"type":"module"` (which exists only so Node treats `assets/js/human-design/*.js` as ESM for tests).

## Reference (read on demand)

- `docs/architecture.md` — site structure, layouts, collections, `nav_active`, front matter, `_data/`, vendor libs, Human Design app. **Read before changing layouts, collections, front matter, or the HD engine.**
- `docs/design.md` — brand, colors, tone, audiences, aesthetic. **Read before visual/design work.**
- `docs/gstack-skills.md` — recommended gstack skills + when to offer them.
