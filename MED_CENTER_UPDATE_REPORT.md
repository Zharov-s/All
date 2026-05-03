# Med Center / Grekova page update

Updated the Grekova medical center page using the uploaded project deck as source content.

## Changed
- Added a full custom `grekova` branch in `renderObjectPage()`.
- Built dedicated page sections: hero, KPIs, technical parameters, floor profile, location, roadmap, commercial terms, investment model, and lots.
- Preserved lot logic without duplicates: rental floor blocks are shown as rental exposure; sale is only whole-building `GRK-SALE-01`; `project with RNS` is shown as a separate deal scenario, not as a catalog lot.
- Kept Yandex route/map logic with exact coordinates: `55.8886667, 37.6617222`.
- Added Grekova-specific CSS while reusing the existing ABCENTRUM visual system.

## Validation
- `node --check data.js`
- `node --check script.js`
- HTMLParser
- tinycss2 parse
- `zip -T`
