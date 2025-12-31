# AO3 Filter Generator

A small, client-side helper that extracts numeric tag IDs from Archive of Our Own (AO3) tag/feed URLs and turns them into an AO3 search query like `filter_ids:123 OR filter_ids:456`.

This is useful when you want a reusable "filter set" of tags (characters, pairings, warnings, etc.) and you'd rather paste one query into AO3 than manually toggle a bunch of filters every time.

## What It Does

- Parses `archiveofourown.org` URLs and pulls the numeric ID from the `/tags/<id>` portion of the path.
- Saves the IDs (optionally with labels) in your browser.
- Generates a combined query string using `filter_ids:<id>` joined with `OR`.
- Lets you organize IDs into custom lists, search your saved items, and bulk-add items to lists.

## How To Use The App

1. Go to an AO3 tag or fandom page (e.g. the page listing works for a character).
2. Right-click the **RSS Feed** button and choose **Copy Link Address**.
3. Paste the link into the **Tag URL** field in this app.
4. (Optional) Add a label so you remember what the ID is.
5. Click **Add**.
6. Use lists and/or the search box to show only the IDs you want in the output.
7. Copy the text from **Generated Filter Query** (or click **Copy to Clipboard**).

Example input:

- `https://archiveofourown.org/tags/60918523/feed.atom`

Example output:

- `filter_ids:60918523`

## How To Use The Query In AO3

Once you've copied the query string from this app, you can use it in two common places on AO3:

1. **Search within Results**: on a works listing page, find the right-hand sidebar, scroll to **"Search within results"**, paste the query, and press Enter.
2. **Advanced / Edit Search**: use **Search > Edit Search** (or pick **Works** from the top dropdown), then paste the query into **"Any field"**.

## Backup & Restore

Your data is stored in your browser's `localStorage` (there's no server component in this project).

- Use **Export** in the sidebar to download a JSON backup.
- Use **Import** in the sidebar to restore from a backup JSON file.

## Development

Prereqs: Node.js + npm.

- Install deps: `npm install`
- Run locally: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`

## Notes / Limitations

- This project only accepts URLs from `archiveofourown.org`.
- It currently expects a numeric tag ID in the path (matching `/tags/<digits>`). If you paste a tag URL that doesn't include a numeric ID, it won't be able to generate a `filter_ids:` query.

## Disclaimer

Not affiliated with or endorsed by Archive of Our Own.
