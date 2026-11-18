# Claude Design handoff

The original design bundle (`callroom-website-design.zip`) as received. `README.md` is the designer's handoff note.

- `pages/` and `canvas-source/`: every page and component as `.dc.html`. These are the source of truth for layout, copy, colours and spacing.
- `image-map.json`: canvas image links → image files. The images themselves live in `public/images/` (one extra, `celebration-menu.webp`, was missing from the zip and was taken from the live design canvas).
- `dc2jsx.py`: the script that converted each `.dc.html` component into `src/components/design/*.jsx`, keeping markup and inline styles verbatim. The generated components were then wired by hand to the cart, catalog, routes and forms, so **don't re-run it over `src/`**. To bring in a design change, convert into a scratch folder and copy across the parts that changed.
