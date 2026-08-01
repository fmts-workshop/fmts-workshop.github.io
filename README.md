# FMTS @ NeurIPS 2026 — workshop website

Source for <https://fmts-workshop.github.io>, the site for **Foundation Models for Temporal
Systems: From Forecasting to World Modeling**, a one-day workshop at
[NeurIPS 2026](https://neurips.cc/Conferences/2026/) in Sydney.

Static HTML and CSS. No build step, no dependencies.

## Running it locally

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

Serve over HTTP rather than opening `index.html` directly, so relative paths and the JavaScript
behave as they do in production.

## Layout

```
index.html        Overview · axes · dates · speakers · organizers · program · contact
cfp.html          Call for Papers — tracks, topics, formatting, review, policies
speakers.html     8 invited speakers
organizers.html   8 organizers · program committee
assets/css/site.css
assets/js/include.js
assets/img/people/*.jpg    16 headshots, 400×400
assets/img/favicon.svg
```

**The nav and footer are duplicated in all four pages.** This is deliberate — `fetch()` of an HTML
partial is blocked by CORS under `file://`, so client-side includes would break local preview. It
does mean **nav changes must be made in all four files**.

`include.js` is progressive enhancement only: it marks the current nav item, runs the mobile menu,
and substitutes an initials monogram if a portrait fails to load. The site remains fully readable
with JavaScript disabled.

## Deploying

Pushing to `main` publishes automatically via GitHub Pages; the rebuild takes about a minute.

```bash
git add -A && git commit -m "..." && git push
```

Pages serves from `main` at the repository root. Paths are relative throughout, so the site also
works from a subpath or a custom domain without modification.

## Editing content

- **Dates** appear in two places — the status band and `#dates` on `index.html`, and `#dates` on
  `cfp.html`. Keep them in sync.
- **People** are portrait cards on `speakers.html` / `organizers.html` and compact tiles on
  `index.html`. Adding or removing someone means editing both.
- **Headshots** are square 400×400 JPEGs in `assets/img/people/`, self-hosted rather than
  hotlinked. To add one:

  ```bash
  sips -s format jpeg -s formatOptions 85 input.png --out /tmp/p.jpg
  S=$(sips -g pixelWidth /tmp/p.jpg | awk '/pixelWidth/{print $2}')
  sips -c "$S" "$S" --cropOffset 0 0 /tmp/p.jpg --out /tmp/sq.jpg
  sips -Z 400 /tmp/sq.jpg --out assets/img/people/firstname-lastname.jpg
  ```

  That top-biased crop suits headshots. For a wider shot, crop manually around the head instead —
  `sips --cropOffset` takes `<vertical> <horizontal>` — then check the result before committing.

If you would prefer a different photo of yourself, or none at all, email the organizers and it will
be replaced or removed.

## Contact

<fmts-neurips2026@googlegroups.com>
