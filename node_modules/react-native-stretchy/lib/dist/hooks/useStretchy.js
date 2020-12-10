import { useImageHeightBasedOnRatio } from './useImageHeightBasedOnRatio';
import { useOnScrollHandle } from './useOnScrollHandle';
export const useStretchy = ({ image, scrollListener }) => {
    const { animation, onScroll, onImageWrapperLayout } = useOnScrollHandle(scrollListener);
    const heightBasedOnRatio = useImageHeightBasedOnRatio(image);
    return {
        animation,
        heightBasedOnRatio,
        onScroll,
        onImageWrapperLayout,
    };
};
