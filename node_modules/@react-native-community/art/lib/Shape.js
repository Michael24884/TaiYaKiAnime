/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import {NativeShape} from './nativeComponents';
import Path from './ARTSerializablePath';
import {
  extractTransform,
  extractShadow,
  extractOpacity,
  childrenAsString,
  extractColor,
  extractStrokeJoin,
  extractStrokeCap,
  extractBrush,
} from './helpers';
import type {
  TransformProps,
  ShadowProps,
  OpacityProps,
  StrokeJoin,
  StrokeCap,
  Brush,
} from './types';

export type ShapeProps = TransformProps &
  ShadowProps &
  OpacityProps & {
    fill?: string | Brush,
    stroke?: string,
    strokeCap?: StrokeCap,
    strokeDash?: Array<number>,
    strokeJoin?: StrokeJoin,
    strokeWidth: number,
    children?: React.Node,
    d?: string | Path,
    children?: string | Array<string>,
    width: number,
    height: number,
  };

export default class Shape extends React.Component<ShapeProps> {
  static defaultProps = {
    strokeWidth: 1,
    width: 0,
    height: 0,
  };

  render() {
    const props = this.props;
    const path = props.d || childrenAsString(props.children);
    const d = (path instanceof Path ? path : new Path(path)).toJSON();

    return (
      <NativeShape
        fill={extractBrush(props.fill, props)}
        opacity={extractOpacity(props)}
        stroke={extractColor(props.stroke)}
        strokeCap={extractStrokeCap(props.strokeCap)}
        strokeDash={props.strokeDash || null}
        strokeJoin={extractStrokeJoin(props.strokeJoin)}
        strokeWidth={props.strokeWidth}
        transform={extractTransform(props)}
        shadow={extractShadow(this.props)}
        d={d}
      />
    );
  }
}
