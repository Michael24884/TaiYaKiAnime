/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {insertColorStopsIntoArray} from './helpers';
import type {GradientStops, Brush} from './types';

const LINEAR_GRADIENT = 1;

export default function LinearGradient(
  stops: GradientStops,
  x1?: number,
  y1?: number,
  x2?: number,
  y2?: number,
): Brush {
  const type = LINEAR_GRADIENT;

  if (arguments.length < 5) {
    const angle = ((x1 == null ? 270 : x1) * Math.PI) / 180;

    let x = Math.cos(angle);
    let y = -Math.sin(angle);
    const l = (Math.abs(x) + Math.abs(y)) / 2;

    x *= l;
    y *= l;

    x1 = 0.5 - x;
    x2 = 0.5 + x;
    y1 = 0.5 - y;
    y2 = 0.5 + y;
    this._bb = true;
  } else {
    this._bb = false;
  }

  const brushData = [type, +x1, +y1, +x2, +y2];
  insertColorStopsIntoArray(stops, brushData, 5);
  this._brush = brushData;
  return this;
}
