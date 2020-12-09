import React from 'react';
import { View, Animated } from 'react-native';
import { commonStyles } from './styles';
import { StretchyProps } from '../types';
import { StretchyImage } from './stretchyImage';
import { useStretchy, UseStretchyOutput } from '../hooks/useStretchy';

export type PropsWithStretchy<P> = P & {
  stretchy: UseStretchyOutput;
};

export type StretchyComponentProps<T> = StretchyProps &
  Omit<Animated.AnimatedProps<T>, 'onScroll'>;

export const WithStretchy = <R, P>(
  WrappedComponent: React.ForwardRefExoticComponent<
    React.PropsWithChildren<PropsWithStretchy<StretchyComponentProps<P>>> &
      React.RefAttributes<R>
  >,
) => {
  const EnhancedComponent = React.forwardRef<
    R,
    React.PropsWithChildren<StretchyComponentProps<P>>
  >((props, ref) => {
    const {
      backgroundColor,
      image,
      imageOverlay,
      imageHeight,
      imageWrapperStyle,
      imageResizeMode,
      onScroll,
    } = props;

    const stretchy = useStretchy({
      image,
      scrollListener: onScroll,
    });

    return (
      <View style={[commonStyles.container, { backgroundColor }]}>
        <StretchyImage
          image={image}
          imageResizeMode={imageResizeMode}
          imageWrapperStyle={imageWrapperStyle}
          animation={stretchy.animation}
          imageHeight={imageHeight || stretchy.heightBasedOnRatio}
          imageOverlay={imageOverlay}
          onLayout={stretchy.onImageWrapperLayout}
        />
        <WrappedComponent {...props} stretchy={stretchy} ref={ref} />
      </View>
    );
  });

  return EnhancedComponent;
};
