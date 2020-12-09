/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {insertDoubleColorStopsIntoArray} from './helpers';
import type {GradientStops, Brush} from './types';

const RADIAL_GRADIENT = 2;

export default function RadialGradient(
  stops: GradientStops,
  fx?: number,
  fy?: number,
  rx?: number,
  ry?: number,
  cx?: number,
  cy?: number,
): Brush {
  if (ry == null) {
    ry = rx;
  }
  if (cx == null) {
    cx = fx;
  }
  if (cy == null) {
    cy = fy;
  }
  if (fx == null) {
    // As a convenience we allow the whole radial gradient to cover the
    // bounding box. We should consider dropping this API.
    fx = fy = rx = ry = cx = cy = 0.5;
    this._bb = true;
  } else {
    this._bb = false;
  }
  // The ART API expects the radial gradient to be repeated at the edges.
  // To simulate this we render the gradient twice as large and add double
  // color stops. Ideally this API would become more restrictive so that this
  // extra work isn't needed.
  const brushData = [RADIAL_GRADIENT, +fx, +fy, +rx * 2, +ry * 2, +cx, +cy];
  insertDoubleColorStopsIntoArray(stops, brushData, 7);
  this._brush = brushData;
  return this;
}
