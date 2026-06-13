# Madhj — Template Three

A production-ready frontend portfolio built on **Elzero Web School — Template Three**.
Static HTML/CSS at the core, enhanced with vanilla JavaScript and a layered design system — no frameworks, no build step.

**Live demo:** [https://ahmedalmadhji.github.io/Template-Three-Frontend-Evolution-Case-Study/](https://ahmedalmadhji.github.io/Template-Three-Frontend-Evolution-Case-Study/)

---

## Overview

This project transforms the original multi-section template into an interactive, portfolio-grade site while preserving the section-based architecture. It demonstrates progressive enhancement, accessible UI patterns, and maintainable CSS layering.

## Sections

| Section | Highlights |
|---------|------------|
| **Landing** | Hero, CTAs, animated scroll indicator |
| **Articles** | Category filters, card grid |
| **Gallery** | Image grid with hover effects |
| **Features** | Value cards with color themes |
| **Testimonials** | Client review cards |
| **Team** | Member cards with social links |
| **Services** | Hover accent cards |
| **Our Skills** | Progress bars |
| **Work Steps** | Step-by-step layout |
| **Events** | Live countdown timer |
| **Pricing** | Plan comparison |
| **Videos** | Playlist + preview panel |
| **Stats** | Animated counters on scroll |
| **Discount** | Validated contact form |
| **Case Study** | Portfolio deep-dive showcase |
| **Footer** | Links, gallery, social |

## JavaScript Modules

All behavior lives in `js/main.js` — seven isolated modules, zero dependencies:

- **StatsCounter** — animates numbers when the stats section enters view
- **Countdown** — live event countdown from `data-countdown-end`
- **MegaMenu** — accessible click-to-toggle menu (keyboard + Escape)
- **ArticlesFilter** — filter cards by `data-category`
- **DiscountForm** / **SubscribeForm** — client-side validation + feedback
- **ScrollNav** — smooth scroll, active nav via `IntersectionObserver`
- **ScrollReveal** — entrance animations (respects `prefers-reduced-motion`)

## CSS Architecture

Styles load in layers — each file extends the previous without breaking structure:

```
Normlazi.css   →  reset / normalize
Madhj.css      →  base template (Elzero)
premium.css    →  visual upgrade (gradients, glass, dark sections)
showcase.css   →  portfolio refinement (spacing, tokens, polish)
```

Brand primary: `#2196F3` · Display font: **Syne** · Body font: **Plus Jakarta Sans**

## Project Structure

```
Template-Three/
├── index.html
├── js/
│   └── main.js
├── Css/
│   ├── Normlazi.css
│   ├── Madhj.css
│   ├── premium.css
│   ├── showcase.css
│   └── all.min.css      # Font Awesome
├── images/
│   └── favicon.svg
└── README.md
```

## Getting Started

No install required. Clone and open locally:

```bash
git clone https://github.com/AhmedAlMadhji/Template-Three.git
cd Template-Three
```

Serve with any static server, for example:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open `http://localhost:8080` in your browser.

## Accessibility

- Semantic HTML (`main`, `section`, `article`, labels)
- ARIA attributes on interactive components
- Keyboard navigation for mega menu and filters
- `prefers-reduced-motion` support for animations
- Screen-reader-only labels on forms

## Credits

- **Template:** [Elzero Web School — Template Three](https://elzero.org/)
- **Instructor:** Osama Elzero
- **Built by:** Ahmed Raed (Madhj)

## License

Educational / portfolio project. Template structure © Elzero Web School.
