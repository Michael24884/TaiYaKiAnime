import React, { useMemo } from 'react';
import { Animated, View, Dimensions, ScrollViewProps } from 'react-native';
import { commonStyles as styles } from './styles';
import {
  StretchyComponentProps,
  WithStretchyProps,
  WithStretchy,
} from './withStretchy';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export type StretchyScrollViewProps = WithStretchyProps &
  StretchyComponentProps<ScrollViewProps>;

const StretchyScrollView: React.FC<StretchyScrollViewProps> = ({
  backgroundColor,
  children,
  foreground,
  imageHeight,
  onScroll,
  stretchy,
  style,
  ...otherProps
}) => {
  const contentMinHeight = useMemo(
    () =>
      stretchy.heightBasedOnRatio
        ? WINDOW_HEIGHT - stretchy.heightBasedOnRatio
        : 0,
    [stretchy.heightBasedOnRatio],
  );

  return (
    <Animated.ScrollView
      {...otherProps}
      style={[style, styles.contentContainer]}
      scrollEventThrottle={1}
      onScroll={stretchy.onScroll}>
      <View
        style={[
          styles.foregroundContainer,
          { height: imageHeight || stretchy.heightBasedOnRatio },
        ]}>
        {foreground}
      </View>
      <View
        style={{
          backgroundColor,
          minHeight: contentMinHeight,
        }}>
        {children}
      </View>
    </Animated.ScrollView>
  );
};

export default WithStretchy<ScrollViewProps>(StretchyScrollView);
