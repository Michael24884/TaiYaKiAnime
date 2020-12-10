/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import Path from './ARTSerializablePath';
import {NativeText} from './nativeComponents';
import {
  extractBrush,
  extractOpacity,
  extractColor,
  extractStrokeCap,
  extractStrokeJoin,
  extractTransform,
  extractShadow,
  extractAlignment,
  childrenAsString,
  extractFontAndLines,
} from './helpers';
import type {
  TransformProps,
  ShadowProps,
  OpacityProps,
  Alignment,
  Brush,
  StrokeCap,
  StrokeJoin,
  Font,
} from './types';

export type TextProps = TransformProps &
  ShadowProps &
  OpacityProps & {
    fill?: string | Brush,
    stroke?: string,
    strokeCap?: StrokeCap,
    strokeDash?: mixed,
    strokeJoin?: StrokeJoin,
    strokeWidth?: mixed,
    children?: string | Array<string>,
    width: number,
    height: number,
    alignment?: Alignment,
    font?: string | Font,
    path?: string | Path,
  };

export default class Text extends React.Component<TextProps> {
  static defaultProps = {
    strokeWidth: 1,
    width: 0,
    height: 0,
  };

  render() {
    const props = this.props;
    const path = props.path;
    const textPath = path
      ? (path instanceof Path ? path : new Path(path)).toJSON()
      : null;
    const textFrame = extractFontAndLines(
      props.font,
      childrenAsString(props.children),
    );
    return (
      <NativeText
        fill={extractBrush(props.fill, props)}
        opacity={extractOpacity(props)}
        stroke={extractColor(props.stroke)}
        strokeCap={extractStrokeCap(props.strokeCap)}
        strokeDash={props.strokeDash || null}
        strokeJoin={extractStrokeJoin(props.strokeJoin)}
        strokeWidth={props.strokeWidth}
        transform={extractTransform(props)}
        alignment={extractAlignment(props.alignment)}
        shadow={extractShadow(this.props)}
        frame={textFrame}
        path={textPath}
      />
    );
  }
}
