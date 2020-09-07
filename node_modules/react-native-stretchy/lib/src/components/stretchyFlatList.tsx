import React from 'react';
import { View, Animated, FlatListProps } from 'react-native';
import { commonStyles as styles } from './styles';
import {
  WithStretchyProps,
  StretchyComponentProps,
  WithStretchy,
} from './withStretchy';

export type StretchyFlatListProps<ItemT> = WithStretchyProps &
  StretchyComponentProps<FlatListProps<ItemT>>;

export type StretchyFlatListComponent = <ItemT>(
  props: StretchyFlatListProps<ItemT>,
) => JSX.Element;

const StretchyFlatList: StretchyFlatListComponent = ({
  foreground,
  imageHeight,
  onScroll,
  stretchy,
  style,
  ...otherProps
}) => (
  <Animated.FlatList
    {...otherProps}
    style={[style, styles.contentContainer]}
    scrollEventThrottle={1}
    onScroll={stretchy.onScroll}
    ListHeaderComponent={
      <View
        style={[
          styles.foregroundContainer,
          { height: imageHeight || stretchy.heightBasedOnRatio },
        ]}>
        {foreground}
      </View>
    }
  />
);

export default WithStretchy<FlatListProps<any>>(StretchyFlatList);
