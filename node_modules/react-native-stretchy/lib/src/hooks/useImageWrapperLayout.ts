import { useState, useCallback } from 'react';
import { LayoutRectangle, LayoutChangeEvent } from 'react-native';

export type UseImageWrapperLayout = () => [
  LayoutRectangle | undefined,
  (event: LayoutChangeEvent) => void,
];

export const useImageWrapperLayout: UseImageWrapperLayout = () => {
  const [imageWrapperLayout, setImageWrapperLayout] = useState<
    LayoutRectangle
  >();

  const onImageWrapperLayout = useCallback(
    (event: LayoutChangeEvent) =>
      setImageWrapperLayout(event.nativeEvent.layout),
    [],
  );

  return [imageWrapperLayout, onImageWrapperLayout];
};
