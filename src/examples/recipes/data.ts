/*
 * The recipes. Each one has a `seed` color, the color of the dish itself: the app builds a whole
 * Material color scheme from it (useScheme.ts), so every recipe paints its card and its page in
 * its own colors. `art` describes the top-down illustration drawn by art.ts.
 */

export type Mood = 'quick' | 'cozy' | 'fresh' | 'spicy' | 'sweet'
export type Aisle = 'Produce' | 'Dairy & eggs' | 'Pantry' | 'Spices' | 'Bakery'
export type DishKind = 'bowl' | 'pasta' | 'salad' | 'tart' | 'stack' | 'toast' | 'taco'

export interface Ingredient {
  qty?: number
  unit?: string
  name: string
  aisle: Aisle
}

export interface Step {
  text: string
  /** Minutes, when the step waits on something. Cook mode offers a timer for it. */
  timer?: number
}

export interface Recipe {
  id: string
  title: string
  blurb: string
  cuisine: string
  seed: string
  art: { kind: DishKind; colors: [string, string, string]; cloth: string }
  minutes: number
  servings: number
  kcal: number
  level: 'Easy' | 'Medium' | 'Weekend'
  moods: Mood[]
  ingredients: Ingredient[]
  steps: Step[]
}

export const moods: { id: Mood; label: string; icon: string }[] = [
  { id: 'quick', label: 'Quick', icon: 'bolt' },
  { id: 'cozy', label: 'Cozy', icon: 'local_fire_department' },
  { id: 'fresh', label: 'Fresh', icon: 'eco' },
  { id: 'spicy', label: 'Spicy', icon: 'whatshot' },
  { id: 'sweet', label: 'Sweet', icon: 'cake' },
]

export const recipes: Recipe[] = [
  {
    id: 'shakshuka',
    title: 'Smoky shakshuka',
    blurb: 'Eggs poached in a paprika tomato sauce, made for tearing bread into.',
    cuisine: 'North African',
    seed: '#c8432b',
    art: { kind: 'bowl', colors: ['#c8432b', '#f6d27a', '#4f8a3c'], cloth: '#f3e1cf' },
    minutes: 30,
    servings: 2,
    kcal: 410,
    level: 'Easy',
    moods: ['cozy', 'spicy'],
    ingredients: [
      { qty: 2, unit: 'tbsp', name: 'olive oil', aisle: 'Pantry' },
      { qty: 1, name: 'onion, sliced', aisle: 'Produce' },
      { qty: 1, name: 'red pepper, sliced', aisle: 'Produce' },
      { qty: 3, name: 'garlic cloves', aisle: 'Produce' },
      { qty: 2, unit: 'tsp', name: 'smoked paprika', aisle: 'Spices' },
      { qty: 1, unit: 'tsp', name: 'ground cumin', aisle: 'Spices' },
      { qty: 800, unit: 'g', name: 'crushed tomatoes', aisle: 'Pantry' },
      { qty: 4, name: 'eggs', aisle: 'Dairy & eggs' },
      { qty: 0.5, unit: 'bunch', name: 'parsley', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Warm the oil in a wide pan over medium heat. Add the onion and pepper and cook until soft and sweet.', timer: 8 },
      { text: 'Stir in the garlic, paprika and cumin. Cook for a minute, until it smells toasty.' },
      { text: 'Pour in the tomatoes, season with salt and let it bubble gently until thick.', timer: 10 },
      { text: 'Make four wells in the sauce, crack an egg into each, cover and cook until the whites set.', timer: 6 },
      { text: 'Scatter parsley over the top and bring the pan to the table with plenty of bread.' },
    ],
  },
  {
    id: 'green-curry',
    title: 'Green curry with greens',
    blurb: 'Coconut, lime leaf and a paste that tastes like a garden on fire.',
    cuisine: 'Thai',
    seed: '#5c8a32',
    art: { kind: 'bowl', colors: ['#7aa83c', '#f2efe1', '#2f5d1c'], cloth: '#e3ecd6' },
    minutes: 35,
    servings: 4,
    kcal: 520,
    level: 'Medium',
    moods: ['spicy', 'cozy'],
    ingredients: [
      { qty: 3, unit: 'tbsp', name: 'green curry paste', aisle: 'Pantry' },
      { qty: 400, unit: 'ml', name: 'coconut milk', aisle: 'Pantry' },
      { qty: 300, unit: 'g', name: 'firm tofu, cubed', aisle: 'Dairy & eggs' },
      { qty: 1, name: 'zucchini, in half moons', aisle: 'Produce' },
      { qty: 150, unit: 'g', name: 'green beans', aisle: 'Produce' },
      { qty: 4, name: 'lime leaves', aisle: 'Produce' },
      { qty: 1, unit: 'tbsp', name: 'soy sauce', aisle: 'Pantry' },
      { qty: 1, unit: 'bunch', name: 'Thai basil', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Fry the curry paste in a splash of the thick coconut cream until it splits and smells fragrant.', timer: 3 },
      { text: 'Add the rest of the coconut milk, the lime leaves and half a cup of water. Bring to a simmer.' },
      { text: 'Drop in the tofu, zucchini and beans and simmer until the beans are just tender.', timer: 8 },
      { text: 'Season with soy sauce, take off the heat and tear in the basil. Serve over rice.' },
    ],
  },
  {
    id: 'lemon-pasta',
    title: 'Lemon ricotta pasta',
    blurb: 'Twenty minutes, one pot, and the brightest bowl of the week.',
    cuisine: 'Italian',
    seed: '#e5b92c',
    art: { kind: 'pasta', colors: ['#f2cf5b', '#fbf6e4', '#6b9a3a'], cloth: '#fbeec8' },
    minutes: 20,
    servings: 2,
    kcal: 560,
    level: 'Easy',
    moods: ['quick', 'fresh'],
    ingredients: [
      { qty: 200, unit: 'g', name: 'spaghetti', aisle: 'Pantry' },
      { qty: 150, unit: 'g', name: 'ricotta', aisle: 'Dairy & eggs' },
      { qty: 1, name: 'lemon, zest and juice', aisle: 'Produce' },
      { qty: 30, unit: 'g', name: 'parmesan, grated', aisle: 'Dairy & eggs' },
      { qty: 1, unit: 'handful', name: 'basil leaves', aisle: 'Produce' },
      { qty: 2, unit: 'tbsp', name: 'olive oil', aisle: 'Pantry' },
    ],
    steps: [
      { text: 'Cook the spaghetti in well-salted boiling water until al dente.', timer: 9 },
      { text: 'Meanwhile, beat the ricotta with the lemon zest and juice, parmesan, oil and lots of black pepper.' },
      { text: 'Scoop out a mug of pasta water, then drain. Toss the pasta with the ricotta, loosening it with the water until glossy.' },
      { text: 'Finish with torn basil and an extra grating of zest.' },
    ],
  },
  {
    id: 'beet-salad',
    title: 'Beet & blood orange salad',
    blurb: 'Jewel colors, salty feta and a honey-sherry dressing.',
    cuisine: 'Mediterranean',
    seed: '#9e1f4f',
    art: { kind: 'salad', colors: ['#a3264f', '#f08a3c', '#5e8f3e'], cloth: '#f4dde3' },
    minutes: 15,
    servings: 2,
    kcal: 290,
    level: 'Easy',
    moods: ['fresh', 'quick'],
    ingredients: [
      { qty: 3, name: 'cooked beets', aisle: 'Produce' },
      { qty: 2, name: 'blood oranges', aisle: 'Produce' },
      { qty: 80, unit: 'g', name: 'feta', aisle: 'Dairy & eggs' },
      { qty: 2, unit: 'handfuls', name: 'rocket', aisle: 'Produce' },
      { qty: 1, unit: 'tbsp', name: 'sherry vinegar', aisle: 'Pantry' },
      { qty: 1, unit: 'tsp', name: 'honey', aisle: 'Pantry' },
      { qty: 30, unit: 'g', name: 'toasted walnuts', aisle: 'Pantry' },
    ],
    steps: [
      { text: 'Cut the beets into wedges. Peel the oranges with a knife and slice them into wheels.' },
      { text: 'Whisk the vinegar, honey, a pinch of salt and three tablespoons of oil.' },
      { text: 'Spread the rocket on a platter, tuck in the beets and oranges, and crumble the feta over.' },
      { text: 'Drizzle with the dressing and scatter the walnuts.' },
    ],
  },
  {
    id: 'blueberry-pancakes',
    title: 'Blueberry buttermilk pancakes',
    blurb: 'Tall, fluffy and bursting, with maple butter melting down the sides.',
    cuisine: 'Diner',
    seed: '#3b4ca0',
    art: { kind: 'stack', colors: ['#e0a957', '#3b4ca0', '#f7eedc'], cloth: '#dfe3f5' },
    minutes: 25,
    servings: 3,
    kcal: 470,
    level: 'Easy',
    moods: ['sweet', 'cozy'],
    ingredients: [
      { qty: 200, unit: 'g', name: 'flour', aisle: 'Pantry' },
      { qty: 2, unit: 'tsp', name: 'baking powder', aisle: 'Pantry' },
      { qty: 1, unit: 'tbsp', name: 'sugar', aisle: 'Pantry' },
      { qty: 300, unit: 'ml', name: 'buttermilk', aisle: 'Dairy & eggs' },
      { qty: 1, name: 'egg', aisle: 'Dairy & eggs' },
      { qty: 40, unit: 'g', name: 'melted butter', aisle: 'Dairy & eggs' },
      { qty: 150, unit: 'g', name: 'blueberries', aisle: 'Produce' },
      { qty: 4, unit: 'tbsp', name: 'maple syrup', aisle: 'Pantry' },
    ],
    steps: [
      { text: 'Whisk the flour, baking powder, sugar and a pinch of salt in a big bowl.' },
      { text: 'Beat the buttermilk, egg and butter, pour into the dry mix and stir until just combined. Lumps are good.' },
      { text: 'Let the batter rest while the pan heats over medium-low.', timer: 5 },
      { text: 'Ladle in the batter, dot with blueberries and flip when bubbles cover the top.', timer: 3 },
      { text: 'Stack them high and pour the maple syrup over.' },
    ],
  },
  {
    id: 'miso-ramen',
    title: 'Weeknight miso ramen',
    blurb: 'A deep, nutty broth in half an hour, with jammy eggs on top.',
    cuisine: 'Japanese',
    seed: '#c0762a',
    art: { kind: 'bowl', colors: ['#d39a4e', '#f7e4a8', '#3e6b2f'], cloth: '#f1e2cc' },
    minutes: 45,
    servings: 2,
    kcal: 640,
    level: 'Medium',
    moods: ['cozy'],
    ingredients: [
      { qty: 2, unit: 'tbsp', name: 'white miso', aisle: 'Pantry' },
      { qty: 1, unit: 'tbsp', name: 'tahini', aisle: 'Pantry' },
      { qty: 1, unit: 'l', name: 'vegetable stock', aisle: 'Pantry' },
      { qty: 2, unit: 'nests', name: 'ramen noodles', aisle: 'Pantry' },
      { qty: 2, name: 'eggs', aisle: 'Dairy & eggs' },
      { qty: 150, unit: 'g', name: 'shiitake', aisle: 'Produce' },
      { qty: 2, name: 'spring onions', aisle: 'Produce' },
      { qty: 1, unit: 'thumb', name: 'ginger', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Boil the eggs for six and a half minutes, then cool them in iced water and peel.', timer: 7 },
      { text: 'Simmer the stock with sliced ginger and the shiitake.', timer: 10 },
      { text: 'Whisk the miso and tahini with a ladle of stock, then stir it back into the pot without boiling.' },
      { text: 'Cook the noodles, divide between bowls and pour the broth over.', timer: 4 },
      { text: 'Top with halved eggs, mushrooms and spring onions.' },
    ],
  },
  {
    id: 'pea-soup',
    title: 'Pea & mint soup',
    blurb: 'Spring in a bowl, ready before the bread is toasted.',
    cuisine: 'British',
    seed: '#5fa04a',
    art: { kind: 'bowl', colors: ['#78b85a', '#f4f1e6', '#2e6b2a'], cloth: '#e6f0dd' },
    minutes: 25,
    servings: 4,
    kcal: 230,
    level: 'Easy',
    moods: ['fresh', 'quick'],
    ingredients: [
      { qty: 1, name: 'leek, sliced', aisle: 'Produce' },
      { qty: 500, unit: 'g', name: 'frozen peas', aisle: 'Produce' },
      { qty: 750, unit: 'ml', name: 'vegetable stock', aisle: 'Pantry' },
      { qty: 1, unit: 'bunch', name: 'mint', aisle: 'Produce' },
      { qty: 4, unit: 'tbsp', name: 'crème fraîche', aisle: 'Dairy & eggs' },
      { qty: 1, unit: 'tbsp', name: 'butter', aisle: 'Dairy & eggs' },
    ],
    steps: [
      { text: 'Soften the leek in the butter with a pinch of salt.', timer: 6 },
      { text: 'Add the peas and stock and simmer until the peas are bright and tender.', timer: 5 },
      { text: 'Blend with most of the mint until completely smooth.' },
      { text: 'Serve with a swirl of crème fraîche and the last mint leaves.' },
    ],
  },
  {
    id: 'plum-galette',
    title: 'Plum & almond galette',
    blurb: 'Rough pastry folded around jammy plums. The rustic look is the point.',
    cuisine: 'French',
    seed: '#6e2a5e',
    art: { kind: 'tart', colors: ['#e3b26a', '#7a2f63', '#f6e7d8'], cloth: '#efdbe8' },
    minutes: 70,
    servings: 6,
    kcal: 380,
    level: 'Weekend',
    moods: ['sweet'],
    ingredients: [
      { qty: 1, unit: 'sheet', name: 'shortcrust pastry', aisle: 'Bakery' },
      { qty: 6, name: 'ripe plums', aisle: 'Produce' },
      { qty: 60, unit: 'g', name: 'ground almonds', aisle: 'Pantry' },
      { qty: 50, unit: 'g', name: 'brown sugar', aisle: 'Pantry' },
      { qty: 1, name: 'egg, beaten', aisle: 'Dairy & eggs' },
      { qty: 2, unit: 'tbsp', name: 'flaked almonds', aisle: 'Pantry' },
    ],
    steps: [
      { text: 'Heat the oven to 200°C. Roll the pastry into a rough circle on a lined tray.' },
      { text: 'Mix the ground almonds with half the sugar and spread it over the middle, leaving a wide border.' },
      { text: 'Fan the sliced plums on top, sprinkle with the rest of the sugar and fold the edges over.' },
      { text: 'Brush the pastry with egg, scatter the flaked almonds and bake until deep golden.', timer: 40 },
      { text: 'Let it cool a little so the juices set, then slice.', timer: 10 },
    ],
  },
  {
    id: 'mango-salad',
    title: 'Mango, chili & lime salad',
    blurb: 'Sweet, sour, hot and crunchy all at once.',
    cuisine: 'Mexican',
    seed: '#f0922a',
    art: { kind: 'salad', colors: ['#f6a83a', '#d6402c', '#4c9a4a'], cloth: '#fde6cc' },
    minutes: 15,
    servings: 2,
    kcal: 210,
    level: 'Easy',
    moods: ['fresh', 'spicy', 'quick'],
    ingredients: [
      { qty: 2, name: 'ripe mangoes', aisle: 'Produce' },
      { qty: 1, name: 'red chili', aisle: 'Produce' },
      { qty: 2, name: 'limes', aisle: 'Produce' },
      { qty: 0.5, name: 'red onion', aisle: 'Produce' },
      { qty: 1, unit: 'bunch', name: 'coriander', aisle: 'Produce' },
      { qty: 40, unit: 'g', name: 'roasted peanuts', aisle: 'Pantry' },
      { qty: 1, unit: 'tsp', name: 'chili flakes', aisle: 'Spices' },
    ],
    steps: [
      { text: 'Cut the mango into long strips and slice the onion and chili as thin as you can.' },
      { text: 'Toss with the lime juice, a pinch of salt and the chili flakes. Leave for five minutes.', timer: 5 },
      { text: 'Fold in the coriander and top with crushed peanuts.' },
    ],
  },
  {
    id: 'mushroom-risotto',
    title: 'Brown butter mushroom risotto',
    blurb: 'Slow stirring, big reward. Nutty, earthy and very creamy.',
    cuisine: 'Italian',
    seed: '#8a6a45',
    art: { kind: 'bowl', colors: ['#c9a774', '#6b4a2f', '#5b8a3c'], cloth: '#eee2d2' },
    minutes: 40,
    servings: 3,
    kcal: 590,
    level: 'Medium',
    moods: ['cozy'],
    ingredients: [
      { qty: 250, unit: 'g', name: 'arborio rice', aisle: 'Pantry' },
      { qty: 300, unit: 'g', name: 'mixed mushrooms', aisle: 'Produce' },
      { qty: 1, name: 'shallot', aisle: 'Produce' },
      { qty: 1, unit: 'l', name: 'hot stock', aisle: 'Pantry' },
      { qty: 60, unit: 'g', name: 'butter', aisle: 'Dairy & eggs' },
      { qty: 50, unit: 'g', name: 'parmesan', aisle: 'Dairy & eggs' },
      { qty: 4, unit: 'sprigs', name: 'thyme', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Cook half the butter until it foams and turns hazelnut brown, then fry the mushrooms in it until golden.', timer: 6 },
      { text: 'Lift out the mushrooms. Soften the shallot in the same pan, then add the rice and toast it.' },
      { text: 'Add the stock a ladle at a time, stirring, until the rice is creamy with a little bite.', timer: 18 },
      { text: 'Beat in the remaining butter and the parmesan, fold the mushrooms back in and rest for two minutes.', timer: 2 },
    ],
  },
  {
    id: 'avocado-toast',
    title: 'Chili crisp avocado toast',
    blurb: 'The classic, but with crunch, heat and a squeeze of lime.',
    cuisine: 'Café',
    seed: '#7c9f3c',
    art: { kind: 'toast', colors: ['#9cc05a', '#c2412d', '#d9a35e'], cloth: '#ebf0d8' },
    minutes: 10,
    servings: 1,
    kcal: 340,
    level: 'Easy',
    moods: ['quick', 'spicy'],
    ingredients: [
      { qty: 2, unit: 'slices', name: 'sourdough', aisle: 'Bakery' },
      { qty: 1, name: 'ripe avocado', aisle: 'Produce' },
      { qty: 0.5, name: 'lime', aisle: 'Produce' },
      { qty: 1, unit: 'tbsp', name: 'chili crisp', aisle: 'Pantry' },
      { qty: 1, unit: 'pinch', name: 'flaky salt', aisle: 'Spices' },
    ],
    steps: [
      { text: 'Toast the sourdough until deeply golden.', timer: 3 },
      { text: 'Mash the avocado with lime juice and salt, leaving some chunks.' },
      { text: 'Pile it onto the toast and spoon the chili crisp over the top.' },
    ],
  },
  {
    id: 'black-bean-tacos',
    title: 'Black bean tacos',
    blurb: 'Smoky beans, quick-pickled onions and a cooling lime crema.',
    cuisine: 'Mexican',
    seed: '#4a2f55',
    art: { kind: 'taco', colors: ['#e9c27a', '#3b2a40', '#c4344f'], cloth: '#e8dcef' },
    minutes: 25,
    servings: 3,
    kcal: 450,
    level: 'Easy',
    moods: ['spicy', 'quick'],
    ingredients: [
      { qty: 800, unit: 'g', name: 'black beans, drained', aisle: 'Pantry' },
      { qty: 1, unit: 'tsp', name: 'chipotle powder', aisle: 'Spices' },
      { qty: 1, name: 'red onion', aisle: 'Produce' },
      { qty: 3, name: 'limes', aisle: 'Produce' },
      { qty: 6, name: 'corn tortillas', aisle: 'Bakery' },
      { qty: 100, unit: 'ml', name: 'sour cream', aisle: 'Dairy & eggs' },
      { qty: 1, name: 'avocado', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Slice the onion thinly and cover with the juice of two limes and a pinch of salt and sugar.', timer: 10 },
      { text: 'Warm the beans with the chipotle and a splash of water, crushing a few of them.', timer: 5 },
      { text: 'Stir the remaining lime juice into the sour cream.' },
      { text: 'Char the tortillas over a flame, fill with beans, avocado, pickled onions and crema.' },
    ],
  },
  {
    id: 'pumpkin-gnocchi',
    title: 'Pumpkin gnocchi, sage butter',
    blurb: 'Pillowy gnocchi in butter that tastes like autumn.',
    cuisine: 'Italian',
    seed: '#d4702a',
    art: { kind: 'pasta', colors: ['#e88f3a', '#f5e3b5', '#5a7d3a'], cloth: '#f8e2cf' },
    minutes: 50,
    servings: 4,
    kcal: 520,
    level: 'Weekend',
    moods: ['cozy'],
    ingredients: [
      { qty: 500, unit: 'g', name: 'roasted pumpkin', aisle: 'Produce' },
      { qty: 250, unit: 'g', name: 'flour', aisle: 'Pantry' },
      { qty: 40, unit: 'g', name: 'parmesan', aisle: 'Dairy & eggs' },
      { qty: 1, name: 'egg yolk', aisle: 'Dairy & eggs' },
      { qty: 80, unit: 'g', name: 'butter', aisle: 'Dairy & eggs' },
      { qty: 12, name: 'sage leaves', aisle: 'Produce' },
      { qty: 1, unit: 'pinch', name: 'nutmeg', aisle: 'Spices' },
    ],
    steps: [
      { text: 'Mash the pumpkin until smooth and let the steam escape so it dries out.', timer: 5 },
      { text: 'Work in the yolk, parmesan, nutmeg and enough flour for a soft dough.' },
      { text: 'Roll into ropes and cut into pillows. Roll each over a fork for ridges.' },
      { text: 'Boil in batches until they float, then a minute more.', timer: 3 },
      { text: 'Fry the sage in the butter until crisp and toss the gnocchi through it.' },
    ],
  },
  {
    id: 'strawberry-pavlova',
    title: 'Strawberry pavlova',
    blurb: 'Crisp outside, marshmallowy inside, piled with cream and berries.',
    cuisine: 'Australian',
    seed: '#d6435f',
    art: { kind: 'tart', colors: ['#f4ece2', '#d6435f', '#5f9a4a'], cloth: '#f9dde2' },
    minutes: 120,
    servings: 8,
    kcal: 310,
    level: 'Weekend',
    moods: ['sweet'],
    ingredients: [
      { qty: 4, name: 'egg whites', aisle: 'Dairy & eggs' },
      { qty: 220, unit: 'g', name: 'caster sugar', aisle: 'Pantry' },
      { qty: 1, unit: 'tsp', name: 'cornflour', aisle: 'Pantry' },
      { qty: 1, unit: 'tsp', name: 'white vinegar', aisle: 'Pantry' },
      { qty: 300, unit: 'ml', name: 'double cream', aisle: 'Dairy & eggs' },
      { qty: 400, unit: 'g', name: 'strawberries', aisle: 'Produce' },
    ],
    steps: [
      { text: 'Heat the oven to 120°C. Whisk the whites to soft peaks, then add the sugar a spoon at a time until glossy.' },
      { text: 'Fold in the cornflour and vinegar and spoon into a tall circle on a lined tray.' },
      { text: 'Bake until crisp and dry to the touch.', timer: 75 },
      { text: 'Turn off the oven and let it cool inside with the door ajar.', timer: 30 },
      { text: 'Whip the cream, pile it on and crown with the strawberries.' },
    ],
  },
]

export const byId = (id: string) => recipes.find((r) => r.id === id)

/** Quantities scaled to a number of servings, written the way a cook reads them (½, 1¼, 250). */
export function formatQty(qty: number | undefined, factor: number) {
  if (qty == null) return ''
  const v = qty * factor
  if (v >= 10) return String(Math.round(v / (v >= 100 ? 10 : 1)) * (v >= 100 ? 10 : 1))
  const whole = Math.floor(v)
  const frac = v - whole
  const fractions: [number, string][] = [[0, ''], [0.25, '¼'], [0.333, '⅓'], [0.5, '½'], [0.667, '⅔'], [0.75, '¾'], [1, '']]
  const [f, glyph] = fractions.reduce((best, cur) => (Math.abs(cur[0] - frac) < Math.abs(best[0] - frac) ? cur : best))
  const w = f === 1 ? whole + 1 : whole
  if (!glyph) return String(w)
  return w ? `${w}${glyph}` : glyph
}
