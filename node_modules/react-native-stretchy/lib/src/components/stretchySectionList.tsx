import React from 'react';
import { View, Animated, SectionListProps } from 'react-native';
import { commonStyles as styles } from './styles';
import {
  WithStretchy,
  StretchyComponentProps,
  WithStretchyProps,
} from './withStretchy';

export type StretchySectionListProps<ItemT> = WithStretchyProps &
  StretchyComponentProps<SectionListProps<ItemT>>;

export type StretchySectionListComponent = <ItemT>(
  props: StretchySectionListProps<ItemT>,
) => JSX.Element;

const StretchySectionList: StretchySectionListComponent = ({
  foreground,
  imageHeight,
  onScroll,
  stretchy,
  style,
  ...otherProps
}) => (
  <Animated.SectionList
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

export default WithStretchy<SectionListProps<any>>(StretchySectionList);
