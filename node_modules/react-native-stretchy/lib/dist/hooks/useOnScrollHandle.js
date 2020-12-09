import { useCallback } from 'react';
import { useImageWrapperLayout } from './useImageWrapperLayout';
import { useStretchyAnimation } from './useStretchyAnimation';
export const useOnScrollHandle = (listener) => {
    const [imageWrapperLayout, onImageWrapperLayout] = useImageWrapperLayout();
    const animationListener = useCallback((offsetY) => {
        if (listener) {
            if (imageWrapperLayout && offsetY >= imageWrapperLayout?.height) {
                listener(offsetY, true);
            }
            else {
                listener(offsetY, false);
            }
        }
    }, [imageWrapperLayout]);
    const { animation, onAnimationEvent } = useStretchyAnimation(animationListener);
    return {
        animation,
        onImageWrapperLayout,
        onScroll: onAnimationEvent,
    };
};
