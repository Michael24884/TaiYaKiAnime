import React from 'react';
import { FlatListProps } from 'react-native';
import { WithStretchyProps, StretchyComponentProps } from './withStretchy';
export declare type StretchyFlatListProps<ItemT> = WithStretchyProps & StretchyComponentProps<FlatListProps<ItemT>>;
export declare type StretchyFlatListComponent = <ItemT>(props: StretchyFlatListProps<ItemT>) => JSX.Element;
declare const _default: React.FC<StretchyComponentProps<FlatListProps<any>>>;
export default _default;
