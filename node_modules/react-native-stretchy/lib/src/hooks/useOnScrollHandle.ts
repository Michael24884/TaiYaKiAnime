import { useCallback } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { StretchyOnScroll } from '../types';
import { useImageWrapperLayout } from './useImageWrapperLayout';
import { useStretchyAnimation } from './useStretchyAnimation';

export type UseOnScrollHandle = (
  listener?: StretchyOnScroll,
) => {
  animation: Animated.Value;
  onImageWrapperLayout(event: LayoutChangeEvent): void;
  onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void;
};

export const useOnScrollHandle: UseOnScrollHandle = (listener) => {
  const [imageWrapperLayout, onImageWrapperLayout] = useImageWrapperLayout();

  const animationListener = useCallback(
    (offsetY: number) => {
      if (listener) {
        if (imageWrapperLayout && offsetY >= imageWrapperLayout?.height) {
          listener(offsetY, true);
        } else {
          listener(offsetY, false);
        }
      }
    },
    [imageWrapperLayout],
  );

  const { animation, onAnimationEvent } = useStretchyAnimation(
    animationListener,
  );

  return {
    animation,
    onImageWrapperLayout,
    onScroll: onAnimationEvent,
  };
};
