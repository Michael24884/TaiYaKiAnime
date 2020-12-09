import React from 'react';
import { View, Animated, FlatListProps, FlatList } from 'react-native';
import { commonStyles as styles } from './styles';
import {
  PropsWithStretchy,
  StretchyComponentProps,
  WithStretchy,
} from './withStretchy';

export type StretchyFlatListProps<ItemT> = React.PropsWithChildren<
  PropsWithStretchy<StretchyComponentProps<FlatListProps<ItemT>>>
>;

const StretchyFlatList = React.forwardRef<
  FlatList,
  StretchyFlatListProps<unknown>
>(
  (
    { foreground, imageHeight, onScroll, stretchy, style, ...otherProps },
    ref,
  ) => (
    <Animated.FlatList
      {...otherProps}
      ref={ref}
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
  ),
);

export default WithStretchy<FlatList, FlatListProps<unknown>>(StretchyFlatList);
