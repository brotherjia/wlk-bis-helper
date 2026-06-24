# WLK Raid BIS Helper V1.1

A lightweight static web app for checking WotLK Classic raid BIS gear by phase, raid size, difficulty, class, and specialization.

## Features

- Filter BIS lists by WotLK phase: P1, P2, P3, and P4
- Filter by raid size: 10-player or 25-player
- Filter by difficulty: Normal or Heroic
- Select class and specialization
- View BIS drops grouped by raid and boss
- Search by boss, item name, or gear slot
- Copy the current BIS list for sharing
- Show weapon subtypes such as one-hand sword, one-hand mace, dagger, bow, shield, and relic type when available
- Search by weapon subtype, for example `单手剑`, `匕首`, `弓`, or `盾牌`
- Feedback entry in the lower-left corner, with a static feedback form that creates a prefilled GitHub Issue.
- Runs entirely in the browser with no backend, database, or login required

## How To Use

Open `index.html` in a browser, then select:

1. Phase
2. Raid size
3. Difficulty
4. Class
5. Specialization

The page will show matching BIS items for the selected setup. Results are grouped by raid and boss, with item names, slots, item IDs, sources, and available stats.

## Deployment

This project is a static site. To publish it with GitHub Pages:

1. Create a new GitHub repository.
2. Upload these files to the repository root:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `data.js`
   - `feedback.html`
   - `README.md`
3. Open repository `Settings`.
4. Go to `Pages`.
5. Select `Deploy from a branch`.
6. Choose the `main` branch and `/root`.
7. Save and wait for GitHub Pages to generate the public link.

## Data Notes

The BIS data is based on WotLK Classic Wowhead BIS references and is organized for raid lookup convenience. Item names are kept in English to preserve accuracy and avoid mistranslation, while the interface, class names, specialization names, raid names, boss names, and labels are presented in Chinese.

## Version History

### V1.1

- Added weapon subtype labels after weapon slots, such as `武器 · 单手剑`, `武器 · 匕首`, `武器 · 弓`, and `盾牌`.
- Added search support for weapon subtypes.
- Restricted subtype detection to real weapon, ranged weapon, off-hand, shield, and relic slots to avoid false labels on items such as necklaces, gloves, and helmets.
- Added a lower-left feedback link and a GitHub Issues powered feedback form.
- Updated project title from V1.0 to V1.1.

### V1.0

- Initial static BIS lookup tool with phase, raid size, difficulty, class, specialization, and keyword filters.

## Files

- `index.html` - main page
- `styles.css` - page styling
- `app.js` - filtering and rendering logic
- `data.js` - BIS dataset

## License

For guild and personal use. Please verify important BIS decisions with current game resources before distributing loot.
