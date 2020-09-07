import React from 'react';
import { SectionListProps } from 'react-native';
import { StretchyComponentProps, WithStretchyProps } from './withStretchy';
export declare type StretchySectionListProps<ItemT> = WithStretchyProps & StretchyComponentProps<SectionListProps<ItemT>>;
export declare type StretchySectionListComponent = <ItemT>(props: StretchySectionListProps<ItemT>) => JSX.Element;
declare const _default: React.FC<StretchyComponentProps<SectionListProps<any>>>;
export default _default;
