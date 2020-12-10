/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import {extractOpacity, extractTransform, extractShadow} from './helpers';
import {NativeGroup} from './nativeComponents';
import type {OpacityProps, TransformProps, ShadowProps} from './types';

type ClippingRectangleProps = OpacityProps &
  TransformProps &
  ShadowProps & {
    x: number,
    y: number,
    width: number,
    height: number,
    children?: React.Node,
  };

export default class ClippingRectangle extends React.Component<ClippingRectangleProps> {
  static defaultProps = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  render() {
    const clipping = [
      this.props.x,
      this.props.y,
      this.props.width,
      this.props.height,
    ];

    // The current clipping API requires x and y to be ignored in the transform
    // $FlowFixMe
    const {x, y, ...propsExcludingXAndY} = this.props;

    return (
      <NativeGroup
        clipping={clipping}
        opacity={extractOpacity(this.props)}
        transform={extractTransform(propsExcludingXAndY)}
        shadow={extractShadow(this.props)}>
        {this.props.children}
      </NativeGroup>
    );
  }
}
