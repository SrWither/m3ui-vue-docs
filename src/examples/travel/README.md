# Travel example ("Driftway")

A travel app for finding places and planning trips, built only with [m3ui-vue](https://m3ui.dev) components. Live at
[m3ui.dev/examples/travel](https://m3ui.dev/examples/travel).

It's the showcase for `MCarousel`: each of its four layouts appears where it fits best.

## Structure

```
travel/
├── TravelExample.vue       MNavigationBar on phones, MNavigationRail with an MFabMenu on wider screens, MTour, the current screen
├── useTravel.ts            navigation with a back stack (and scroll restore), saved places, trips, stories, the tour
├── data.ts                 destinations, things to do, itineraries and sample trips (dates relative to today)
├── art.ts                  destination pictures drawn as SVG (data URIs: no image hosting)
├── components/
│   ├── AppHeader.vue       logo or back button, title, theme, back to the docs, source
│   ├── StoryViewer.vue     full-screen vertical MCarousel stories with progress segments
│   └── BoardingPass.vue    the outbound flight and its check-in state
└── views/
    ├── ExploreView.vue     MSearchBar; stories; MCarousel hero, multi-browse rows and an uncontained row
    ├── DestinationView.vue large MTopAppBar that hands over to a small one on scroll; gallery MCarousel; facts; things to do
    ├── PlanView.vue        MSelect, MDateRangePickerModal, MNumberField, MTagInput, a live summary
    ├── TripView.vue        boarding pass + MPinInput check-in, MScheduler itinerary, MConfirmDialog to delete
    ├── TripsView.vue       upcoming and past trips (MSegmentedButton), MEmptyState
    └── SavedView.vue       saved destinations
```

## How it works

- **Carousels**: the featured row is a `hero` carousel, collections are `multi-browse` rows, "Things to do" is an
  `uncontained` row with custom cards, and stories are a `full-screen` vertical carousel. Captions follow the visible part
  of each item through the `--m3-carousel-mask-start` / `--m3-carousel-mask-size` CSS variables.
- **Trips**: planning one builds an itinerary with two activities a day, picked from the destination. In the itinerary,
  click an empty hour to add an activity and an activity to remove it (with undo). The sample trip to Lisbon starts
  tomorrow, so it's in this week's view.
- **Check-in**: type the booking reference printed on the boarding pass into the code field.
- **The welcome tour** shows once; clear `driftway-tour-seen` from local storage to see it again.
- **Pictures** are generated SVG scenes (beaches, mountains, cities, deserts, forests, snow, lakes, islands) from a seed
  per destination, so every place has its own gallery.
