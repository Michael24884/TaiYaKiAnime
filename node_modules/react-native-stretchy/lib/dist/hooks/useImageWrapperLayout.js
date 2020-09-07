import { useState, useCallback } from 'react';
export const useImageWrapperLayout = () => {
    const [imageWrapperLayout, setImageWrapperLayout] = useState();
    const onImageWrapperLayout = useCallback((event) => setImageWrapperLayout(event.nativeEvent.layout), []);
    return [imageWrapperLayout, onImageWrapperLayout];
};
