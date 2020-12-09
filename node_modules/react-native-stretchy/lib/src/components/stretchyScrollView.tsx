import React, { useMemo } from 'react';
import {
  Animated,
  View,
  Dimensions,
  ScrollViewProps,
  ScrollView,
} from 'react-native';
import { commonStyles as styles } from './styles';
import {
  StretchyComponentProps,
  PropsWithStretchy,
  WithStretchy,
} from './withStretchy';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export type StretchyScrollViewProps = React.PropsWithChildren<
  PropsWithStretchy<StretchyComponentProps<ScrollViewProps>>
>;

const StretchyScrollView = React.forwardRef<
  ScrollView,
  StretchyScrollViewProps
>(
  (
    {
      backgroundColor,
      children,
      foreground,
      imageHeight,
      onScroll,
      stretchy,
      style,
      ...otherProps
    },
    ref,
  ) => {
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
        ref={ref}
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
  },
);

export default WithStretchy<ScrollView, ScrollViewProps>(StretchyScrollView);
