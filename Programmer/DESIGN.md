---
name: Organic Harvest
colors:
  surface: '#f8faf6'
  surface-dim: '#d8dbd7'
  surface-bright: '#f8faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f0'
  surface-container: '#eceeeb'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e1e3df'
  on-surface: '#191c1a'
  on-surface-variant: '#434840'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#eff1ed'
  outline: '#73796f'
  outline-variant: '#c3c8bd'
  surface-tint: '#476642'
  primary: '#173416'
  on-primary: '#ffffff'
  primary-container: '#2d4b2a'
  on-primary-container: '#98ba90'
  inverse-primary: '#add0a4'
  secondary: '#54634b'
  on-secondary: '#ffffff'
  secondary-container: '#d4e5c7'
  on-secondary-container: '#58674f'
  tertiary: '#482508'
  on-tertiary: '#ffffff'
  tertiary-container: '#623b1c'
  on-tertiary-container: '#dda67f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c8ecbf'
  primary-fixed-dim: '#add0a4'
  on-primary-fixed: '#042105'
  on-primary-fixed-variant: '#304e2d'
  secondary-fixed: '#d7e8ca'
  secondary-fixed-dim: '#bbccaf'
  on-secondary-fixed: '#121f0c'
  on-secondary-fixed-variant: '#3c4b35'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#f4bb92'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#653d1e'
  background: '#f8faf6'
  on-background: '#191c1a'
  surface-variant: '#e1e3df'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Newsreader
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-xl-mobile:
    fontFamily: Newsreader
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is rooted in the philosophy of "Modern Agronomy"—blending the raw, honest beauty of organic farming with the precision of a high-end digital marketplace. The brand personality is healthy, transparent, and grounded, aiming to evoke a sense of trust as if the user were buying directly from a boutique farm stand.

The visual style follows a **Modern Minimalist** approach with subtle **Tactile** influences. It prioritizes high-quality, vibrant product photography against soft, natural backgrounds. The interface remains quiet to let the freshness of the produce act as the primary visual driver. This design system avoids loud gradients or aggressive shadows, opting instead for a sophisticated, editorial feel that treats vegetables and fruits with the same reverence as luxury goods.

## Colors
The palette is derived directly from the lifecycle of a plant: the deep chlorophyll of healthy foliage, the soft mint of new sprouts, and the rich loamy earth that sustains them.

- **Primary (Forest Green):** Used for navigation, primary actions, and footers to establish authority and growth.
- **Secondary (Pale Sage):** Used for large surface areas and section backgrounds to create a calming, organic atmosphere.
- **Tertiary (Earth Brown):** Used sparingly for accents, badges, or price points to provide a grounded contrast.
- **Neutral (Cream White):** The primary canvas color, replacing harsh pure whites with a warmer, more natural tone that feels premium and approachable.

Functional colors (Success, Warning, Error) should be slightly desaturated to maintain the natural aesthetic without losing their semantic utility.

## Typography
The typography strategy utilizes a dual-font system to balance editorial elegance with functional clarity.

**Newsreader** serves as the display typeface. Its calligraphic serifs and varied stroke weights reflect the organic irregularities of nature. It should be used for headlines, storytelling elements, and product names.

**Plus Jakarta Sans** provides a clean, geometric contrast for utility. Its high x-height and open apertures ensure maximum readability for product descriptions, pricing, and navigational elements.

To maintain an "organic" feel, avoid heavy all-caps usage except for small functional labels. Use generous line height to prevent the text from feeling cramped, mirroring the airy layout of the brand.

## Layout & Spacing
This design system employs a **Fluid Grid** model with high internal breathing room. The layout is structured on a 12-column grid for desktop and a 4-column grid for mobile.

- **Desktop:** 12 columns, 24px gutters, and wide 64px margins to create an "expansive" feel.
- **Section Gaps:** Vertical rhythm is intentionally slow. Large 80px - 120px gaps between sections are encouraged to allow the eye to rest and focus on individual product categories.
- **Content Reflow:** On mobile, product grids collapse from 4 columns to 2, ensuring that food photography remains large enough to be appetizing. High-level categories use horizontal swiping containers to preserve vertical space.

## Elevation & Depth
Elevation is conveyed through **Tonal Layering** rather than traditional shadows. Surfaces sit on top of one another using subtle color shifts (e.g., a Secondary Green card sitting on a Neutral Cream background).

Where depth is required for interactive elements:
- **Soft Ambient Shadows:** Use extremely diffused, low-opacity shadows (Opacity: 4-6%) with a slight tint of the primary green. This avoids "dirty" gray shadows and keeps the UI looking fresh.
- **Inner Borders:** Use 1px borders in a shade slightly darker than the background (e.g., a "Soil" tint) to define card boundaries without creating a heavy box-shadow effect.
- **Photography Depth:** Rely on the natural depth-of-field in product photos to create a 3D sense of space within the flat UI.

## Shapes
The shape language is defined by "Natural Curves." While strict geometric squares feel too industrial, overly pill-shaped elements feel too playful. 

The `roundedness: 2` (0.5rem base) setting provides a sophisticated softness that mimics the rounded edges of a leaf or a smooth pebble. 
- **Small Elements:** Buttons and input fields use the base 0.5rem radius.
- **Large Elements:** Product cards and hero containers use `rounded-lg` (1rem) to emphasize their role as containers of "freshness."
- **Icons:** Should feature rounded terminals and consistent stroke weights to match the body typography.

## Components
- **Buttons:** Primary buttons should be solid Forest Green with white text. Secondary buttons should be Ghost style with a Forest Green border or solid Pale Sage with Forest Green text.
- **Product Cards:** Use a Pale Sage background for the image container to make the colors of the produce "pop." Text information should sit on the Neutral Cream surface below the image.
- **Chips:** Used for "Organic," "Local," or "Seasonal" tags. Use Tertiary Brown backgrounds with white text for high-contrast callouts, or light tonal variants for less critical metadata.
- **Input Fields:** Minimalist design with a 1px "Soil" border. Focus states should shift the border to Primary Green and add a very soft outer glow.
- **Quantity Pickers:** A custom component with (+) and (-) icons. Ensure the touch target is generous (44px+) for ease of use in a kitchen or on-the-go environment.
- **Progressive Disclosure:** Use clean accordion lists for farm sourcing details and nutritional information to keep product pages uncluttered.