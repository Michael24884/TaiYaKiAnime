import { Animated, } from 'react-native';
import { useState, useCallback } from 'react';
export const useStretchyAnimation = (listener) => {
    const [animation] = useState(new Animated.Value(1));
    const onAnimationEvent = useCallback(Animated.event([
        {
            nativeEvent: {
                contentOffset: { y: animation },
            },
        },
    ], {
        useNativeDriver: true,
        listener: ({ nativeEvent: { contentOffset } }) => listener && listener(contentOffset.y),
    }), [listener]);
    return { animation, onAnimationEvent };
};
