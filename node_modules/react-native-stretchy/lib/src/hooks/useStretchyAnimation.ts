import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useState, useCallback } from 'react';

export type UseStretchyAnimation = (
  listener?: (offsetY: number) => void,
) => {
  animation: Animated.Value;
  onAnimationEvent: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

export const useStretchyAnimation: UseStretchyAnimation = (listener) => {
  const [animation] = useState(new Animated.Value(1));

  const onAnimationEvent = useCallback(
    Animated.event<NativeScrollEvent>(
      [
        {
          nativeEvent: {
            contentOffset: { y: animation },
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: ({ nativeEvent: { contentOffset } }) =>
          listener && listener(contentOffset.y),
      },
    ),
    [listener],
  );

  return { animation, onAnimationEvent };
};
