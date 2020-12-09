declare module '@react-native-community/art' {
  import {ViewStyle, StyleProp} from 'react-native';
  import React from 'react';

  export interface ARTNodeMixin {
    opacity?: number;
    originX?: number;
    originY?: number;
    scaleX?: number;
    scaleY?: number;
    scale?: number;
    title?: string;
    x?: number;
    y?: number;
    visible?: boolean;
    shadowOpacity?: number;
    shadowColor?: string | number;
    shadowRadius?: number;
    shadowOffset?: {
      x: number,
      y: number,
    }
  }

  export interface ARTGroupProps extends ARTNodeMixin {
    width?: number;
    height?: number;
  }

  export interface ARTClippingRectangleProps extends ARTNodeMixin {
    width?: number;
    height?: number;
  }

  export interface ARTRenderableMixin extends ARTNodeMixin {
    fill?: string;
    stroke?: string;
    strokeCap?: 'butt' | 'square' | 'round';
    strokeDash?: number[];
    strokeJoin?: 'bevel' | 'miter' | 'round';
    strokeWidth?: number;
  }

  export interface ARTShapeProps extends ARTRenderableMixin {
    d: string;
    width?: number;
    height?: number;
  }

  export interface ARTTextProps extends ARTRenderableMixin {
    font?: string;
    alignment?: string;
  }

  export interface ARTSurfaceProps {
    style?: StyleProp<ViewStyle>;
    width: number;
    height: number;
  }

  export class ClippingRectangle extends React.Component<ARTClippingRectangleProps> {}

  export class Group extends React.Component<ARTGroupProps> {}

  export class Shape extends React.Component<ARTShapeProps> {}

  export class Surface extends React.Component<ARTSurfaceProps> {}

  export class Text extends React.Component<ARTTextProps> {}
}
