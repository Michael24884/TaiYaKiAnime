import { useEffect, useState, useMemo } from 'react';
import { Image, Dimensions } from 'react-native';
const WINDOW_WIDTH = Dimensions.get('window').width;
export const useImageHeightBasedOnRatio = (image) => {
    const [ratio, setRatio] = useState(0);
    const imageHeightBasedOnRatio = useMemo(() => (ratio > 1 ? WINDOW_WIDTH / ratio : WINDOW_WIDTH * ratio), [ratio]);
    useEffect(() => {
        if (image) {
            const imageUri = image.uri;
            if (imageUri) {
                Image.getSize(imageUri, (width, height) => {
                    setRatio(width / height);
                }, () => null);
            }
            else {
                const { width, height } = Image.resolveAssetSource(image);
                setRatio(width / height);
            }
        }
    }, [image]);
    return imageHeightBasedOnRatio;
};
