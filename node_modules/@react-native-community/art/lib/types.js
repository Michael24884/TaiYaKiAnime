/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export type OpacityProps = {
  visible?: boolean,
  opacity?: number,
};

export type TransformProps = {
  scaleX?: number,
  scaleY?: number,
  scale?: number,
  x?: number,
  y?: number,
  rotation?: number,
  originX?: number,
  originY?: number,
  transform?: {
    y?: number,
    x?: number,
    yy?: number,
    xx?: number,
    yx?: number,
    xy?: number,
  },
};

export type ShadowProps = {
  shadowOpacity?: number,
  shadowColor?: string | number,
  shadowRadius?: number,
  shadowOffset?: {x: number, y: number},
};

export type ARTColor = {
  isColor: true,
  red: string,
  green: string,
  blue: string,
  alpha: string,
};
export type ColorType = string | number | ARTColor;

export type StrokeJoin = 'miter' | 'bevel' | 'round';
export type StrokeCap = 'butt' | 'square' | 'round';
export type Alignment = 'center' | 'right' | 'left';

export type Brush = {_brush: Array<number>, _bb?: boolean};
export type Font = {
  fontFamily: string,
  fontSize?: number,
  fontWeight?: string,
  fontStyle?: string,
};

export type GradientStops = {[key: string]: ColorType} | Array<ColorType>;
