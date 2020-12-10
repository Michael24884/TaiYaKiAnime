/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import {NativeGroup} from './nativeComponents';
import {extractOpacity, extractTransform, extractShadow} from './helpers';
import type {OpacityProps, TransformProps, ShadowProps} from './types';

type GroupProps = OpacityProps &
  ShadowProps &
  TransformProps & {
    children: React.Node,
  };

export default class Group extends React.Component<GroupProps> {
  static contextTypes = {
    isInSurface: PropTypes.bool.isRequired,
  };

  render() {
    invariant(
      this.context.isInSurface,
      'ART: <Group /> must be a child of a <Surface />',
    );

    return (
      <NativeGroup
        opacity={extractOpacity(this.props)}
        transform={extractTransform(this.props)}
        shadow={extractShadow(this.props)}>
        {this.props.children}
      </NativeGroup>
    );
  }
}
