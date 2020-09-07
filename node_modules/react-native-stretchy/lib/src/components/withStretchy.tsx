import React from 'react';
import { View, Animated } from 'react-native';
import { commonStyles } from './styles';
import { StretchyProps } from '../types';
import { StretchyImage } from './stretchyImage';
import { useStretchy, UseStretchyOutput } from '../hooks/useStretchy';

export interface WithStretchyProps {
  stretchy: UseStretchyOutput;
}

export type StretchyComponentProps<T> = StretchyProps &
  Omit<Animated.AnimatedProps<T>, 'onScroll'>;

export const WithStretchy = <T extends {}>(
  WrappedComponent: React.FC<
    StretchyComponentProps<T> & WithStretchyProps
  >,
) => {
  const EnhancedComponent: React.FC<StretchyComponentProps<T>> = (props) => {
    const {
      backgroundColor,
      gradient,
      image,
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
          gradient={gradient}
          animation={stretchy.animation}
          imageHeight={imageHeight || stretchy.heightBasedOnRatio}
          onLayout={stretchy.onImageWrapperLayout}
        />
        <WrappedComponent stretchy={stretchy} {...props} />
      </View>
    );
  };

  return EnhancedComponent;
};
