import {
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
} from 'react-native';
import { StretchyImage, StretchyOnScroll } from '../types';
import { useImageHeightBasedOnRatio } from './useImageHeightBasedOnRatio';
import { useOnScrollHandle } from './useOnScrollHandle';

export type UseStretchyOutput = {
  animation: Animated.Value;
  heightBasedOnRatio: number;
  onScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void;
  onImageWrapperLayout(event: LayoutChangeEvent): void;
}

export type UseStretchy = (config: {
  image?: StretchyImage;
  scrollListener?: StretchyOnScroll;
}) => UseStretchyOutput;

export const useStretchy: UseStretchy = ({ image, scrollListener }) => {
  const { animation, onScroll, onImageWrapperLayout } = useOnScrollHandle(
    scrollListener,
  );

  const heightBasedOnRatio = useImageHeightBasedOnRatio(image);

  return {
    animation,
    heightBasedOnRatio,
    onScroll,
    onImageWrapperLayout,
  };
};
