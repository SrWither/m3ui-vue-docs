# Store example

A home-goods shop built only with [m3ui-vue](https://m3ui.dev) components, from browsing to checkout. Live at
[m3ui.dev/examples/store](https://m3ui.dev/examples/store).

## Structure

```
store/
├── StoreExample.vue        header (search, cart, back to docs), the current screen, the cart sheet
├── useStore.ts             catalog, filters, cart, coupons, shipping and totals
├── art.ts                  product pictures and banners drawn as SVG (data URIs: no image hosting)
├── components/
│   ├── ProductCard.vue     picture, sale/new badges, rating, price, quick add with a "View cart" toast action
│   ├── Filters.vue         MCheckbox categories, MSlider price range, rating chips, MSwitch in stock
│   └── CartSheet.vue       MSideSheet cart: quantities, free-shipping progress, MTextField coupon
└── views/
    ├── ShopView.vue        MSimpleCarousel hero; MSupportingPane: grid + filters (a bottom sheet on phones); MSelect sort
    ├── ProductView.vue     gallery with MLightbox, color variants, MSegmentedButton sizes, MNumberField quantity, MRating reviews
    └── CheckoutView.vue    MStepper: shipping (MTextField, MMaskField, MSelect), delivery (MRadioGroup), payment, review; MResult
```

## How it works

- **Filters** sit beside the grid on wide screens and move into a bottom sheet on phones, both from one
  `MSupportingPane` with `single-pane="sheet"`.
- **The checkout** validates each step when you press Continue (errors appear on the fields and on the step in
  `MStepper`); completed steps can be revisited from the stepper or the review's Edit buttons. "Fill with test data"
  completes the forms; no payment is made.
- **Coupons** `M3UI` (10%) and `WELCOME` (15%); standard shipping is free over $50.
- **Pictures** are SVG drawings generated per product and color in `art.ts`, so every variant has its own image and
  the lightbox has three views of each.
