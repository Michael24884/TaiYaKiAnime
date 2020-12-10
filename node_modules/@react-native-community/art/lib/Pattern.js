/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Brush} from './types';

const PATTERN = 3;

export default function Pattern(
  url: number,
  width: number,
  height: number,
  left?: number,
  top?: number,
): Brush {
  return {
    _brush: [PATTERN, url, +left || 0, +top || 0, +width, +height],
  };
}
