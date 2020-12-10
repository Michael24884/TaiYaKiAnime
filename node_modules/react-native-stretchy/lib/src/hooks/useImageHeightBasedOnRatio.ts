import { useEffect, useState, useMemo } from 'react';
import { Image, Dimensions, ImageURISource } from 'react-native';
import { StretchyImage } from '../types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export type UseImageHeightBasedOnRatio = (image?: StretchyImage) => number;

export const useImageHeightBasedOnRatio: UseImageHeightBasedOnRatio = (
  image,
) => {
  const [ratio, setRatio] = useState(0);

  const imageHeightBasedOnRatio = useMemo(
    () => (ratio > 1 ? WINDOW_WIDTH / ratio : WINDOW_WIDTH * ratio),
    [ratio],
  );

  useEffect(() => {
    if (image) {
      const imageUri = (image as ImageURISource).uri;

      if (imageUri) {
        Image.getSize(
          imageUri,
          (width, height) => {
            setRatio(width / height);
          },
          () => null,
        );
      } else {
        const { width, height } = Image.resolveAssetSource(image);
        setRatio(width / height);
      }
    }
  }, [image]);

  return imageHeightBasedOnRatio;
};
