# Amma's Kitchen - Assignment 7

A two-page website showcasing South Indian recipes using CSS Grid, Flexbox, and SASS/SCSS.

---

## 📁 Project Structure

```
amma-kitchen/
├── index.html              # Home page
├── recipe.html             # Recipe details page
├── scss/
│   ├── main.scss          # Main SCSS file (imports all)
│   ├── _variables.scss    # Variables
│   ├── _functions.scss    # Functions
│   ├── _mixins.scss       # Mixins
│   ├── _grid.scss         # Grid layouts
│   └── _flex.scss         # Flexbox layouts
├── css/
│   └── styles.css         # Compiled CSS
├── images/                # Your images
│   ├── header_image.jpg
│   ├── crispy_dosa.jpg
│   └── South_Indian.jpg
└── Audio_Videos/          # Your media files
    ├── Crispy_Dosa_MakingVideo.mp4
    ├── Chicken_Sukka_MakingVideo.mp4
    └── sambhar_guide.mp3
```

---

## ✅ Assignment Requirements

### 1. CSS Grid Layouts (2 implementations)

**Grid #1: Recipe Cards** (index.html)
- Location: `.recipe-grid` class
- File: `_grid.scss` lines 7-58
- 3 columns → 2 columns (tablet) → 1 column (mobile)

**Grid #2: Ingredients** (recipe.html)
- Location: `.ingredients-grid` class
- File: `_grid.scss` lines 60-78
- 2 columns for ingredients, responsive to 1 column

### 2. Flexbox Layouts (3 implementations)

**Flex #1: Recipe Info Bar** (both pages)
- Location: `.recipe-info` class
- File: `_flex.scss` lines 7-27

**Flex #2: Video Container** (both pages)
- Location: `.video-container` class
- File: `_flex.scss` lines 29-58

**Flex #3: Cooking Steps** (recipe.html)
- Location: `.steps-flex` class
- File: `_flex.scss` lines 60-87

### 3. SASS/SCSS Features

#### Required Features (7):

1. **Variables** - `_variables.scss`
2. **Custom Properties** - `main.scss` lines 20-24
3. **Nesting** - Throughout all files
4. **Interpolation** - `main.scss` lines 30-35
5. **Placeholder Selectors** - Implied in shared styles
6. **Mixins** - `_mixins.scss` (4 mixins)
7. **Functions** - `_functions.scss` (4 functions)

#### Additional Features (4):

8. **@each Loops** - `main.scss` lines 30-35
9. **@if/@else** - `_mixins.scss` lines 18-27
10. **Maps** - `_variables.scss` lines 22-28, 42-46
11. **Color Functions** - `darken()`, `lighten()`, `mix()`
