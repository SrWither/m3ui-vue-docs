# Recipes example

A cooking app, Simmer, built only with [m3ui-vue](https://m3ui.dev) components to show off Material You's
content color: every dish builds its own color scheme, and the app wears it.
Live at [m3ui.dev/examples/recipes](https://m3ui.dev/examples/recipes).

## Structure

```
recipes/
├── RecipesExample.vue       layout: MNavigationRail on wide screens, MShortNavigationBar on phones, top bar, pages,
│                            cook mode; puts the open recipe's scheme on <html>; loads the Fraunces display font
├── useScheme.ts             the open recipe's scheme (generateScheme) as --color-* variables for <html>
├── useRecipes.ts            shared state: navigation (back), saved, servings, grocery list and cooking timers
├── data.ts                  the recipes: seed color, ingredients by aisle, steps with optional timers
├── art.ts                   top-down dish illustrations drawn as SVG (bowls, pasta, salads, tarts, pancakes, toast, tacos)
├── rng.ts                   a tiny seeded random generator
├── components/
│   ├── RecipeCard.vue       a grid card in the recipe's colors, or a dish cut into a shape for the shelves
│   ├── TimerRing.vue        a step's countdown on the wavy MCircleProgressBar
│   └── TopBar.vue           the cookie-shaped logo, theme, docs and source
└── views/
    ├── TodayView.vue        greeting, search, mood chips, hero MCarousel, shelves and every recipe
    ├── RecipeView.vue       the dish (tap it to morph its shape), facts in shapes, servings, segmented ingredients, method
    ├── CookMode.vue         full-screen steps: a new container color and a morphing shape per step, timers, swipe
    ├── SavedView.vue        saved dishes
    └── GroceriesView.vue    the merged grocery list by aisle, swipe to remove
```

## How it works

- **Content color.** Each recipe has a `seed`, the color of the dish. Cards, the hero carousel and the grocery
  dots wrap themselves in `MScheme` with that seed (variant `content`, so the primary container keeps the seed's
  own hue and chroma and the accents stay analogous): every color utility and component inside uses the dish's
  scheme. An open recipe puts its scheme on `<html>` instead (`useScheme`, the library's `generateScheme` as
  `--color-*` variables), so teleported pieces (toasts, the ingredients sheet, tooltips) match too. Leaving the
  recipe removes them and your palette comes back. Nothing is stored, so the docs' palette is never touched.
- **Shapes.** Dishes are clipped into Material 3's expressive shapes with `MShape`; the recipe's hero morphs to
  the next one on every tap, and cook mode's background shape morphs with every step.
- **Servings** scale every quantity, written the way a cook reads them (½, 1¼, 250 g).
- **Groceries.** "Add to list" merges a recipe's ingredients into the list (same name and unit add up) and
  remembers which recipes each item is for; the dots next to an item are those recipes' colors.
- **Cook mode** keeps the screen awake (Screen Wake Lock, where supported). Timers live in shared state, so
  they keep counting if you leave cook mode, and pills at the top jump to steps whose timer is running.
- Saved recipes and the grocery list persist in `localStorage`.
