# ImgPiecer - Dynamic Image Animation Library

A lightweight JavaScript library for creating stunning image animations with customizable piece-by-piece effects.

## Installation

```html
<script src="ImgPiecer.js"></script>
```

## Basic Usage

```javascript
const container = document.getElementById('animation-container');
const piecer = new ImgPiecer(container, {
    imageUrl: 'path/to/image.jpg',
    rows: 5,
    columns: 5,
    direction: 'spiral'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| imageUrl | string | '' | URL of the image to animate |
| rows | number | 5 | Number of rows to split the image into |
| columns | number | 5 | Number of columns to split the image into |
| animationDuration | number | 1 | Duration of animation in seconds |
| direction | string | 'top' | Animation effect to use |
| initialOpacity | number | 0 | Starting opacity of pieces (0-1) |
| spin | boolean | false | Enable rotation during animation |

## Animation Effects

### Basic Directional Effects
- `left` - Pieces enter from left
- `right` - Pieces enter from right
- `top` - Pieces enter from top
- `bottom` - Pieces enter from bottom

### Curtain Effects
- `curtain-left` - Pieces sweep in from left like a curtain
- `curtain-right` - Pieces sweep in from right like a curtain
- `curtain-top` - Pieces sweep in from top like a curtain
- `curtain-bottom` - Pieces sweep in from bottom like a curtain

### Complex Effects
- `explode` - Pieces explode outward from their positions
- `implode` - Pieces fly in from outside toward their positions
- `spiral` - Pieces form a spiral pattern before assembling
- `wave` - Pieces move in a wave-like motion
- `grow-in` - Pieces grow from small to full size
- `grow-out` - Pieces shrink from large to normal size
- `domino` - Pieces appear in a diagonal cascade
- `vortex` - Pieces swirl in from the edges
- `shutter` - Pieces flip in like window shutters
- `hypno` - Complex spiral motion with 3D rotation

## Effect-Specific Notes

### Spin Option Compatibility
The `spin` option works best with:
- All directional effects (left, right, top, bottom)
- Implode
- Vortex
- Wave

Not recommended with:
- Shutter (has built-in rotation)
- Hypno (has complex built-in motion)
- Grow-in/Grow-out (interferes with scaling)

### Initial Opacity Notes
- `initialOpacity` has no effect on `explode` (starts fully visible)
- For best results with `hypno`, keep `initialOpacity` at 0

### Animation Duration
- `hypno` effect automatically extends duration by 6x for smoother motion
- `spiral` splits duration into three phases (formation, assembly, expansion)
- `wave` effect uses duration for each column's movement

## Performance Considerations

1. Image Size
   - Recommended maximum image size: 1920x1080px
   - Larger images may cause performance issues on mobile devices

2. Grid Size
   - Recommended maximum: 10x10 grid (100 pieces)
   - Complex effects (hypno, spiral) work best with 5x5 to 8x8 grids

3. Browser Support
   - Requires modern browser with CSS transform support
   - 3D effects (hypno, shutter) require CSS transform-style: preserve-3d

## Examples

### Basic Animation
```javascript
new ImgPiecer(container, {
    imageUrl: 'image.jpg',
    rows: 5,
    columns: 5,
    direction: 'spiral'
});
```

### Complex Animation with Options
```javascript
new ImgPiecer(container, {
    imageUrl: 'image.jpg',
    rows: 8,
    columns: 8,
    direction: 'hypno',
    animationDuration: 2,
    initialOpacity: 0,
    spin: false
});
```

### Mobile-Optimized Configuration
```javascript
new ImgPiecer(container, {
    imageUrl: 'image.jpg',
    rows: 4,
    columns: 4,
    direction: 'wave',
    animationDuration: 1.5,
    spin: false
});
```

## Browser Support
- Chrome 49+
- Firefox 52+
- Safari 10+
- Edge 79+
- Opera 36+

## License
MIT License - feel free to use in personal and commercial projects.
