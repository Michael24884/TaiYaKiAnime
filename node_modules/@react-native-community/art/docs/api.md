# API

## Surface

Container for all other ART components

|   Prop   |     Type     | Default |
| :------: | :----------: | :-----: |
|  height  |   `number`   |   `0`   |
|  width   |   `number`   |   `0`   |
|  style   |    `any`     |   ---   |
| children | `React.Node` |   ---   |

```jsx
import {Surface} from '@react-native-community/art';

function Heart() {
  return (
    <Surface width={500} height={500}>
      {renderARTShapes()}
    </Surface>
  );
}
```

## Group

Container to combine shapes or other groups into hierarchies that can be transformed as a set.

|       Prop        |                 Type                  | Default |
| :---------------: | :-----------------------------------: | :-----: |
|  ...opacityProps  |   [`OpacityProps`](###OpacityProps)   |   ---   |
| ...transformProps | [`TransformProps`](###TransformProps) |   ---   |
|  ...shadowProps   |    [`ShadowProps`](###ShadowProps)    |   ---   |
|     children      |             `React.Node`              |   ---   |

```jsx
import {Surface, Group} from '@react-native-community/art';

function GrouppedHearts() {
  return (
    <Surface width={500} height={500}>
      <Group>{renderARTGroupContents()}</Group>
    </Surface>
  );
}
```

## Shape

Used to draw arbitrary vector shapes from Path. Shape implements Transform as a mixin which means it has all transform methods available for moving, scaling and rotating a shape.

|       Prop        |                 Type                  |  Default  |
| :---------------: | :-----------------------------------: | :-------: |
|  ...opacityProps  |   [`OpacityProps`](###OpacityProps)   |    ---    |
| ...transformProps | [`TransformProps`](###TransformProps) |    ---    |
|  ...shadowProps   |    [`ShadowProps`](###ShadowProps)    |    ---    |
|        fill        |           `string \| Brush`           |    ---    |
|      stroke       |               `string`                |    ---    |
|     strokeCap     |    `'butt' \| 'square' \| 'round'`    | `'round'` |
|    strokeDash     |            `Array<number>`            |    ---    |
|    strokeJoin     |    `'miter' \| 'bevel' \| 'round'`    | `'round'` |
|    strokeWidth    |               `number`                |    `1`    |
|         d         |           `string \| Path`            |    ---    |
|       width       |               `number`                |    `0`    |
|      height       |               `number`                |    `0`    |
|     children      |             `React.Node`              |    ---    |

```jsx
import {Surface, Shape, Path} from '@react-native-community/art';

function SomeShape() {
  return (
    <Surface width={500} height={500}>
      <Shape d={new Path().moveTo(0, 0).lineTo(200, 200)} fill="#d39494" />
    </Surface>
  );
}
```

## Text

Text component creates a shape based on text content using native text rendering.

|       Prop        |                 Type                  |  Default  |
| :---------------: | :-----------------------------------: | :-------: |
|  ...opacityProps  |   [`OpacityProps`](###OpacityProps)   |    ---    |
| ...transformProps | [`TransformProps`](###TransformProps) |    ---    |
|  ...shadowProps   |    [`ShadowProps`](###ShadowProps)    |    ---    |
|        fill        |           `string \| Brush`           |    ---    |
|      stroke       |               `string`                |    ---    |
|     strokeCap     |    `'butt' \| 'square' \| 'round'`    | `'round'` |
|    strokeDash     |            `Array<number>`            |    ---    |
|    strokeJoin     |    `'miter' \| 'bevel' \| 'round'`    | `'round'` |
|    strokeWidth    |               `number`                |    `1`    |
|       width       |               `number`                |    `0`    |
|      height       |               `number`                |    `0`    |
|     alignment     |    `'center' \| 'left' \| 'right'`    | `'left'`  |
|       font        |           `string \| Font`            |    ---    |
|       path        |           `string \| Path`            |    ---    |
|     children      |       `string \| Array<string>`       |    ---    |

## Path

Generate an SVG `path` that you can pass to the `Shape` element.

### `constructor`

```jsx
new Path(path: string | Path)
```

### `move`

Move current context from current position by `x` and `y`.

```jsx
function move(x: number, y: number): Path;
```

### `moveTo`

Move current context from current position to absolute coordinate `x` and `y`.

```jsx
function moveTo(x: number, y: number): Path;
```

### `line`

Draw a line from current position to relative `x` and `y`.

```jsx
function line(x: number, y: number): Path;
```

### `lineTo`

Draw a line from current poistion to absolute coordinate `x` and `y`.

```jsx
function lineTo(x: number, y: number): Path;
```

### `curve`

Draw a cubic bezier curve to relative position.

```jsx
function curve(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  deltaX: number,
  deltaY: number,
): Path;
```

### `curveTo`

Draw a bezier curve to absolute position.

```jsx
function curveTo(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  deltaX: number,
  deltaY: number,
): Path
```

### `arc`

Draw an arc with specific arguments.

```jsx
function arc(
  x: number,
  y: number,
  xRadius: number,
  yRadius: number,
  outer?: boolean,
  counterClockWise?: boolean,
  rotation?: number,
): Path;
```

### `arcTo`

Draw an arc to absolute coordinates.

```jsx
function arcTo(
  x: number,
  y: number,
  xRadius: number,
  yRadius: number,
  outer?: boolean,
  counterClockWise?: boolean,
  rotation?: number,
): Path;
```

### `counterArc`

Same as `arc`, opposite clockwise.

### `counterArcTo`

Same as `arcTo`, opposite clockwise.

### `close`

Draws a line to the first point in the current sub-path and begins a new sub-path.

```jsx
function close(): Path;
```

### `reset`

Reset the current path.

```jsx
function reset(): Path;
```

### `toJSON`

Return the current path points, which can be used on Shape d attribute.

```jsx
function toJSON() => Array<number | string>;
```

## LinearGradient

Creates a linear gradient fill.

```jsx
function LinearGradient({
  stops: GradientStops,
  x1?: number,
  y1?: number,
  x2?: number,
  y2?: number,
}): Brush;
```

## RadialGradient

Creates a radial gradient fill.

```jsx
function RadialGradient({
  stops: GradientStops,
  x1?: number,
  y1?: number,
  x2?: number,
  y2?: number,
}): Brush;
```

## Pattern

Creates a pattern fill.

> _This component is not exactly working as expected. [More context here.](https://github.com/facebook/react-native/issues/1462)_

```jsx
function Pattern(
  url: number | string,
  width: number,
  height: number,
  left?: number,
  top?: number,
): Brush;
```

## Transform

Generate a transform that can applied to ART elements.

[Transform docs](https://github.com/sebmarkbage/art/blob/842d2d56c6436adc0bbb0c065a296f295b95bc0a/docs/ART/ART.Transform.md)

## ClippingRectangle

Control display area of graphic.

|      Prop       |      Type      | Default |
| :-------------: | :------------: | :-----: |
| ...opacityProps | `OpacityProps` |   ---   |
|        x        |    `number`    |   `0`   |
|        y        |    `number`    |   `0`   |
|      width      |    `number`    |   `0`   |
|     height      |    `number`    |   `0`   |
|    children     |  `React.Node`  |   ---   |

```jsx
import React from 'react';
import {
  Surface,
  ClippingRectangle,
  Shape,
  Path,
} from '@react-native-community/art';

function Component() {
  return (
    <Surface width={200} height={200}>
      <ClippingRectangle width={20} height={20} x={100} y={100}>
        <Shape
          d={new Path().moveTo(0, 0).lineTo(200, 200)}
          stroke="black"
          strokeWidth={10}
        />
      </ClippingRectangle>
    </Surface>
  );
}
```

## Common types

### OpacityProps

|  Prop   |   Type    | Default |
| :-----: | :-------: | :-----: |
| visible | `boolean` | `true`  |
| opacity | `number`  |   ---   |

### TransformObject

| Prop |   Type   | Default |
| :--: | :------: | :-----: |
|  y   | `number` |   `0`   |
|  x   | `number` |   `0`   |
|  yy  | `number` |   `1`   |
|  xx  | `number` |   `1`   |
|  yx  | `number` |   `0`   |
|  xy  | `number` |   `0`   |

### TransformProps

|   Prop    |       Type        | Default |
| :-------: | :---------------: | :-----: |
|  scaleX   |     `number`      |   `1`   |
|  scaleY   |     `number`      |   `1`   |
|   scale   |     `number`      |   ---   |
|     x     |     `number`      |   `0`   |
|     y     |     `number`      |   `0`   |
| rotation  |     `number`      |   `0`   |
|  originX  |     `number`      |   ---   |
|  originY  |     `number`      |   ---   |
| transform | `TransformObject` |   ---   |

### ShadowProps

|     Prop      |         Type         | Default  |
| :-----------: | :------------------: | :------: |
| shadowOpacity |       `number`       |    `1`   |
| shadowColor   |       `string`       |  `black` |
| shadowRadius  |       `number`       |    `0`   |
| shadowOffset  | `ShadowOffsetObject` |    ---   |

### ShadowOffsetObject

| Prop |   Type   | Default |
| :--: | :------: | :-----: |
|  y   | `number` |   `0`   |
|  x   | `number` |   `0`   |

### Font

|    Prop    |   Type   | Default |
| :--------: | :------: | :-----: |
| fontFamily | `string` |   ---   |
|  fontSize  | `number` |  `12`   |
| fontWeight | `string` | `'400'` |
| fontStyle  | `string` |   ---   |
