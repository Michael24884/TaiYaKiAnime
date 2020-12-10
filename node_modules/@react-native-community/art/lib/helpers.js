/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import processColor from 'react-native/Libraries/StyleSheet/processColor';
import Color from 'art/core/color';
import Transform from 'art/core/transform';
import {Platform} from 'react-native';
import type {
  Alignment,
  Brush,
  ColorType,
  Font,
  GradientStops,
  OpacityProps,
  StrokeCap,
  StrokeJoin,
  TransformProps,
  ShadowProps,
} from './types';

export function childrenAsString(children?: string | Array<string>) {
  if (!children) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (children.length) {
    return children.join('\n');
  }
  return '';
}

export function extractOpacity({visible, opacity}: OpacityProps) {
  // TODO: visible === false should also have no hit detection
  if (visible === false) {
    return 0;
  }
  if (opacity == null) {
    return 1;
  }
  return +opacity;
}

const pooledTransform = new Transform();

export function extractTransform(props: TransformProps): Array<number> {
  const scaleX =
    props.scaleX != null ? props.scaleX : props.scale != null ? props.scale : 1;
  const scaleY =
    props.scaleY != null ? props.scaleY : props.scale != null ? props.scale : 1;

  pooledTransform
    .transformTo(1, 0, 0, 1, 0, 0)
    .move(props.x || 0, props.y || 0)
    .rotate(props.rotation || 0, props.originX, props.originY)
    .scale(scaleX, scaleY);

  if (props.transform != null) {
    pooledTransform.transform(props.transform);
  }

  return [
    pooledTransform.xx,
    pooledTransform.yx,
    pooledTransform.xy,
    pooledTransform.yy,
    pooledTransform.x,
    pooledTransform.y,
  ];
}

function toHex(color: Color) {
  const intValues = [color.red, color.green, color.blue];
  if (color.alpha < 1) {
    // Android uses AARRGGBB ; iOS uses RRGGBBAA
    // https://developer.android.com/reference/android/graphics/Color.html#parseColor(java.lang.String)
    const position = Platform.OS === 'android' ? 0 : 3;
    intValues.splice(position, 0, Math.round(color.alpha * 255));
  }
  const hexValues = intValues.map(iv => {
    const sv = iv.toString(16);
    return sv.length === 1 ? '0' + sv : sv;
  });
  return '#' + hexValues.join('');
}

export function extractShadow(
  props: ShadowProps,
): Array<number | null | void> | void {
  if (
    !props.shadowColor &&
    !props.shadowOpacity &&
    !props.shadowRadius &&
    !props.shadowOffset
  ) {
    return;
  }

  let opacity = props.shadowOpacity;

  if (opacity === null || opacity === undefined) {
    opacity = 1;
  }

  return [
    processColor(props.shadowColor || 'black'),
    opacity,
    props.shadowRadius || 4,
    props.shadowOffset?.x || 0,
    props.shadowOffset?.y || 0,
  ];
}

export function extractColor(color?: ColorType) {
  if (color == null) {
    return null;
  }
  return toHex(new Color(color));
}

export function extractStrokeJoin(strokeJoin?: StrokeJoin) {
  switch (strokeJoin) {
    case 'miter':
      return 0;
    case 'bevel':
      return 2;
    default:
      return 1; // round
  }
}

export function extractStrokeCap(strokeCap?: StrokeCap) {
  switch (strokeCap) {
    case 'butt':
      return 0;
    case 'square':
      return 2;
    default:
      return 1; // round
  }
}

const SOLID_COLOR = 0;
const LINEAR_GRADIENT = 1;
const RADIAL_GRADIENT = 2;
const PATTERN = 3;

// TODO: Refactor and simplify applyBoundingBoxToBrushData and extractBrush

function applyBoundingBoxToBrushData(
  brushData: Array<number>,
  props: {width: number, height: number},
) {
  const type = brushData[0];
  const width = +props.width;
  const height = +props.height;
  if (type === LINEAR_GRADIENT) {
    brushData[1] *= width;
    brushData[2] *= height;
    brushData[3] *= width;
    brushData[4] *= height;
  } else if (type === RADIAL_GRADIENT) {
    brushData[1] *= width;
    brushData[2] *= height;
    brushData[3] *= width;
    brushData[4] *= height;
    brushData[5] *= width;
    brushData[6] *= height;
  } else if (type === PATTERN) {
    // todo
  }
}

export function extractBrush(
  colorOrBrush?: Brush | string,
  props: {width: number, height: number},
) {
  if (colorOrBrush == null) {
    return null;
  }
  if (colorOrBrush._brush) {
    if (colorOrBrush._bb) {
      // The legacy API for Gradients allow for the bounding box to be used
      // as a convenience for specifying gradient positions. This should be
      // deprecated. It's not properly implemented in canvas mode. ReactART
      // doesn't handle update to the bounding box correctly. That's why we
      // mutate this so that if it's reused, we reuse the same resolved box.

      // $FlowFixMe
      applyBoundingBoxToBrushData(colorOrBrush._brush, props);
      // $FlowFixMe
      colorOrBrush._bb = false;
    }
    return colorOrBrush._brush;
  }
  const c = new Color(colorOrBrush);
  return [SOLID_COLOR, c.red / 255, c.green / 255, c.blue / 255, c.alpha];
}

export function extractAlignment(alignment?: Alignment) {
  switch (alignment) {
    case 'right':
      return 1;
    case 'center':
      return 2;
    default:
      return 0; // left
  }
}

const cachedFontObjectsFromString = {};

const fontFamilyPrefix = /^[\s"']*/;
const fontFamilySuffix = /[\s"']*$/;

function extractSingleFontFamily(fontFamilyString: string) {
  // ART on the web allows for multiple font-families to be specified.
  // For compatibility, we extract the first font-family, hoping
  // we'll get a match.
  return fontFamilyString
    .split(',')[0]
    .replace(fontFamilyPrefix, '')
    .replace(fontFamilySuffix, '');
}

function parseFontString(font: string) {
  if (cachedFontObjectsFromString.hasOwnProperty(font)) {
    return cachedFontObjectsFromString[font];
  }
  const regexp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm\%]*(?:\s*\/.*?)?\s+)?\s*\"?([^\"]*)/i;
  const match = regexp.exec(font);
  if (!match) {
    return null;
  }
  const fontFamily = extractSingleFontFamily(match[3]);
  const fontSize = +match[2] || 12;
  const isBold = /bold/.exec(match[1]);
  const isItalic = /italic/.exec(match[1]);
  cachedFontObjectsFromString[font] = {
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
  };
  return cachedFontObjectsFromString[font];
}

function extractFont(font?: string | Font) {
  if (font == null) {
    return null;
  }
  if (typeof font === 'string') {
    return parseFontString(font);
  }
  const fontFamily = extractSingleFontFamily(font.fontFamily);
  const fontSize = +font.fontSize || 12;
  const fontWeight =
    font.fontWeight != null ? font.fontWeight.toString() : '400';
  return {
    // Normalize
    fontFamily: fontFamily,
    fontSize: fontSize,
    fontWeight: fontWeight,
    fontStyle: font.fontStyle,
  };
}

const newLine = /\n/g;
export function extractFontAndLines(font?: string | Font, text: string) {
  return {font: extractFont(font), lines: text.split(newLine)};
}

function insertColorIntoArray(color: ColorType, targetArray, atIndex) {
  const c = new Color(color);
  targetArray[atIndex + 0] = c.red / 255;
  targetArray[atIndex + 1] = c.green / 255;
  targetArray[atIndex + 2] = c.blue / 255;
  targetArray[atIndex + 3] = c.alpha;
}

function insertColorsIntoArray(
  stops: GradientStops,
  targetArray: Array<number>,
  atIndex: number,
) {
  let i = 0;
  if ('length' in stops) {
    // $FlowFixMe: stops is Array here
    while (i < stops.length) {
      // $FlowFixMe: stops is Array here
      insertColorIntoArray(stops[i], targetArray, atIndex + i * 4);
      i++;
    }
  } else {
    // $FlowFixMe stops is Object here
    for (const offset in stops) {
      insertColorIntoArray(stops[offset], targetArray, atIndex + i * 4);
      i++;
    }
  }
  return atIndex + i * 4;
}

function insertOffsetsIntoArray(
  stops: GradientStops,
  targetArray: Array<number>,
  atIndex: number,
  multi: number,
  reverse: boolean,
) {
  let offsetNumber;
  let i = 0;
  if ('length' in stops) {
    // $FlowFixMe: stops is Array here
    while (i < stops.length) {
      // $FlowFixMe: stops is Array here
      offsetNumber = (i / (stops.length - 1)) * multi;
      targetArray[atIndex + i] = reverse ? 1 - offsetNumber : offsetNumber;
      i++;
    }
  } else {
    // $FlowFixMe stops is Object here
    for (const offsetString in stops) {
      offsetNumber = +offsetString * multi;
      targetArray[atIndex + i] = reverse ? 1 - offsetNumber : offsetNumber;
      i++;
    }
  }
  return atIndex + i;
}

export function insertColorStopsIntoArray(
  stops: GradientStops,
  targetArray: Array<number>,
  atIndex: number,
) {
  const lastIndex = insertColorsIntoArray(stops, targetArray, atIndex);
  insertOffsetsIntoArray(stops, targetArray, lastIndex, 1, false);
}

export function insertDoubleColorStopsIntoArray(
  stops: GradientStops,
  targetArray: Array<number>,
  atIndex: number,
) {
  let lastIndex = insertColorsIntoArray(stops, targetArray, atIndex);
  lastIndex = insertColorsIntoArray(stops, targetArray, lastIndex);
  lastIndex = insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, false);
  insertOffsetsIntoArray(stops, targetArray, lastIndex, 0.5, true);
}
