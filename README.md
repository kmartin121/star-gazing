# Backyard Stargazing Logs

Visual observation logs from backyard sessions with a Celestron StarSense Explorer 150mm Dobsonian.

## View on GitHub Pages

Once Pages is enabled (Settings → Pages → Deploy from a branch → `main` / `/ (root)`), open:

**https://kmartin121.github.io/star-gazing/**

That index lists each night (5 latest by default) and can filter by year and month. Direct log URLs look like:

`https://kmartin121.github.io/star-gazing/logs/2026/09/2026-09-12.html`

After you push to `main`, wait about a minute for Pages to rebuild, then hard-refresh if needed.

You can also open `index.html` directly in a browser (no local server needed).

## Layout

```text
star-gazing/
  index.html
  README.md
  assets/
    css/styles.css
    js/theme.js
    js/index.js
    js/sessions.js
  logs/
    YYYY/
      MM/
        YYYY-MM-DD.html
```

| Path | Purpose |
|------|---------|
| `assets/css/styles.css` | Shared layout, dark mode, mobile, and print styles |
| `assets/js/theme.js` | Dark/light toggle, print-as-light, home bar on log pages |
| `assets/js/sessions.js` | Catalog of sessions for the index list and filters |
| `assets/js/index.js` | Renders and filters the homepage session list |
| `logs/YYYY/MM/YYYY-MM-DD.html` | One observation log per night |

## Log a new session

1. Copy an existing log under `logs/` into the right year/month folder, e.g. `logs/2026/09/2026-09-18.html` (create the month folder if needed).
2. Update the date, session time, sky conditions, and each target entry (name, specs, notes, sketch).
3. Keep `data-home="../../../index.html"` on `<body>` so the home icon resolves from `logs/YYYY/MM/`.
4. Add a catalog entry to `assets/js/sessions.js` inside `window.STARGAZING_SESSIONS` (order in the file does not matter; the index sorts by `date`):

```js
{
  id: "2026-09-18",
  href: "logs/2026/09/2026-09-18.html",
  session: 3,
  date: "2026-09-18",
  title: "Session 3",
  summary: "Short summary of targets and time range."
}
```

5. Commit and push to `main`. Pages will publish the update automatically — you do not need to edit `index.html`.
