import React from 'react';
import { View, Animated, SectionListProps, SectionList } from 'react-native';
import { commonStyles as styles } from './styles';
import {
  WithStretchy,
  StretchyComponentProps,
  PropsWithStretchy,
} from './withStretchy';

export type StretchySectionListProps<ItemT> = React.PropsWithChildren<
  PropsWithStretchy<StretchyComponentProps<SectionListProps<ItemT>>>
>;

const StretchySectionList = React.forwardRef<
  SectionList,
  StretchySectionListProps<unknown>
>(
  (
    { foreground, imageHeight, onScroll, stretchy, style, ...otherProps },
    ref,
  ) => (
    <Animated.SectionList
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

export default WithStretchy<SectionList, SectionListProps<unknown>>(
  StretchySectionList,
);
