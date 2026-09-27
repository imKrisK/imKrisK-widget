# Theme Design Specification: "Calligraphy & Ink"

## Overview
An elegant, intentional theme that breaks the mold of generic portfolio designs. Inspired by bespoke legal documents, artisan craftsmanship, and the precision of hand-calligraphy.

---

## Color Palette

### Primary Colors
- **Deep Navy**: `#1a1f3a` - Main background (dark, sophisticated)
- **Charcoal**: `#2a2e4a` - Secondary background
- **Aged Paper**: `#f5f3f0` - Light text, accents

### Accent Colors
- **Rose Gold**: `#c99a7f` - Primary accent (elegant, distinctive)
- **Copper**: `#b87d5b` - Secondary accent (warmth)
- **Gold Dust**: `#d4a574` - Highlights

### Neutral Colors
- **Cream**: `#ede9e0` - Light backgrounds, text
- **Soft Grey**: `#a89a8f` - Secondary text
- **Ink Black**: `#1a1a1a` - Deep text (strong contrast)

---

## Typography

### Headings
- **H1** (Name): "Playfair Display" or serif fallback
  - Size: 2.8em
  - Weight: 700
  - Color: Aged Paper (#f5f3f0) with Rose Gold gradient option
  - Letter spacing: -0.5px

- **H2** (Section Titles): "Cormorant Garamond" or serif fallback
  - Size: 2em
  - Weight: 600
  - Color: Rose Gold (#c99a7f) with Aged Paper alternative
  - Letter spacing: 0.5px
  - Elegant underline accent

- **H3** (Subsections): Serif font
  - Size: 1.4em
  - Weight: 600
  - Color: Aged Paper (#f5f3f0)

### Body Text
- **Paragraph**: "Lora" or system serif
  - Size: 1em
  - Weight: 400
  - Line height: 1.7
  - Color: Cream (#ede9e0)

- **Labels/Small Text**: Sans-serif
  - Size: 0.85em
  - Weight: 500
  - Color: Soft Grey (#a89a8f)
  - Text transform: uppercase
  - Letter spacing: 0.8px

### Special Cases
- **Metrics Value**: Monospace or elegant number font
  - Size: 1.8em
  - Weight: 700
  - Color: Rose Gold (#c99a7f)

---

## Design Elements

### Dividers & Separators
- **Thin line**: 1px solid `rgba(201, 154, 127, 0.3)` (Rose Gold, transparent)
- **Ornamental divider**: Subtle decorative element using:
  - Unicode ornaments: ✦ ✧ ◆ ◇
  - Or custom SVG flourishes
  - Color: Rose Gold at 60% opacity
  - Spacing: 12px vertical margin

### Cards & Containers
- **Background**: `rgba(42, 46, 74, 0.5)` (Charcoal with transparency)
- **Border**: 1px solid `rgba(201, 154, 127, 0.2)` (Rose Gold, faint)
- **Hover Effect**: 
  - Border brightens to `rgba(201, 154, 127, 0.4)`
  - Subtle shadow: `0 8px 20px rgba(201, 154, 127, 0.08)`
  - No scale transform (keeps intentional, calm)

### Buttons
- **Style**: Outline button (not filled)
- **Border**: 1.5px solid Rose Gold (#c99a7f)
- **Text**: Aged Paper (#f5f3f0)
- **Hover**: 
  - Background: `rgba(201, 154, 127, 0.1)`
  - Border: Gold Dust (#d4a574)
- **Active**: 
  - Background: `rgba(201, 154, 127, 0.2)`
  - Border: Rose Gold (#c99a7f)
  - Font weight: 600

### Metric Cards
- **Layout**: Elegant, spacious
- **Label**: Uppercase, Rose Gold, small
- **Value**: Large, Monospace, Rose Gold
- **Detail**: Cream text, serif, elegant
- **Accent line**: Left or top border in Rose Gold (2px)

### Tabs
- **Inactive**: Text in Soft Grey (#a89a8f)
- **Active**: 
  - Text in Aged Paper (#f5f3f0)
  - Underline: 2px solid Rose Gold (#c99a7f)
  - No background color (clean)

---

## Layout & Spacing

### Padding Standards
- **Large sections**: 48px top/bottom, 20px sides
- **Card content**: 24px
- **Button padding**: 12px 24px (compact, elegant)
- **Text gaps**: 8-16px (generous, breathing room)

### Grid Systems
- **Max width**: 900px for content (narrow, focused)
- **Metric cards**: 3-column on desktop, responsive
- **Gap between cards**: 20px (breathing room)

---

## Artistic Touches

### Ornamental Elements
1. **Header flourish**: Subtle decorative line below name
   - Made with: `::before` or `::after` pseudo-element
   - Content: Thin line with side flourishes
   - Color: Rose Gold (#c99a7f)
   - Height: 2px

2. **Section dividers**: Unicode ornaments
   - Options: ✦ ◆ ◇ (solid, not outlined)
   - Color: Rose Gold (#c99a7f) at 70% opacity
   - Spacing: Centered, vertical padding 20px

3. **Metric card accent**: Left border accent
   - Width: 3px
   - Color: Rose Gold (#c99a7f)
   - Creates visual hierarchy

4. **Footer watermark**: Elegant serif text
   - Color: Soft Grey (#a89a8f)
   - Font: Serif, italic
   - Size: 0.9em
   - Opacity: 0.8

### Background Textures (Optional)
- **Aged paper grain**: Subtle texture overlay (~1% opacity)
  - Adds tactile quality without overwhelming
- **Ink bleeding effect**: Very subtle on edges
  - Only if it doesn't impact readability

---

## Interactive States

### Hover Effects
- **Cards**: Border brightens, shadow emerges (no scale)
- **Buttons**: Background tints to Rose Gold (10% opacity)
- **Links/Text**: Color shifts to Gold Dust (#d4a574), underline appears
- **Tabs**: Underline weight increases, text brightens

### Transitions
- Duration: 200-300ms (smooth, not instant)
- Easing: `ease-in-out` (natural)
- Property: `all` or specific (color, border-color, box-shadow)

---

## Responsive Design

### Desktop (>1024px)
- 2-column layout (Portfolio | FT0 Chat)
- Full metric cards with 3-column grid
- Standard spacing and typography

### Tablet (768px-1024px)
- Stack to 1-column, then side-by-side
- Metric cards: 2-column grid
- Slightly reduced padding

### Mobile (<768px)
- Single column
- Metric cards: 1-column
- Typography: Slightly smaller
- Padding: 16px (compact)

---

## Fonts to Import (Google Fonts or fallbacks)

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@300;400;600&family=Lora:wght@400;500;600&display=swap');

Fallback stack:
- Headings: "Playfair Display", "Cormorant Garamond", Georgia, serif;
- Body: "Lora", Georgia, serif;
- UI: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif;
```

---

## Key Principles

1. **Elegance through Simplicity**: No unnecessary flourishes
2. **Intentionality**: Every design choice has purpose (reflects Operations mindset)
3. **Readability First**: Beautiful typography that's easy to read
4. **Calm Confidence**: Warm palette, generous spacing, no aggressive colors
5. **Memorable Distinctiveness**: Break the mold without being trendy
6. **Professional Authenticity**: Bespoke, not corporate template

---

## Comparison to Other Options

| Aspect | Calligraphy & Ink | Legal Ledger | Operations Dashboard |
|--------|-------------------|--------------|----------------------|
| **Formality** | High (elegant) | Very High (traditional) | Medium (modern) |
| **Warmth** | Warm (Rose Gold) | Cold (navy/gold) | Neutral (cool greys) |
| **Distinctiveness** | High (artistic) | Medium (classic) | Medium (trendy) |
| **Personality** | Artistic + precise | Conservative + authoritative | Tech-forward |
| **Recruiter Impact** | Memorable, unique | Safe, trustworthy | Modern, professional |

---

## Fallback Strategy

If Calligraphy & Ink doesn't resonate after Phase 1, we can pivot to:
- **Legal Ledger**: More burgundy, gold, leather textures
- **Operations Dashboard**: More teal, wood tones, technical vibes

All themes use the same component structure—only CSS changes needed.
