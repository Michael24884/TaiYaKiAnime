import { Dimensions } from 'react-native';
import { renderHook } from '@testing-library/react-hooks';
import { useImageHeightBasedOnRatio } from './useImageHeightBasedOnRatio';
import { MOCK_IMAGE_WIDTH, MOCK_IMAGE_HEIGHT } from '../../__mocks__/RNImage';

const WINDOW_WIDTH = Dimensions.get('window').width;

describe('Hooks', () => {
  describe('useImageHeightBasedOnRatio', () => {
    const ratio = MOCK_IMAGE_WIDTH / MOCK_IMAGE_HEIGHT;
    const expected = ratio > 1 ? WINDOW_WIDTH / ratio : WINDOW_WIDTH * ratio;

    test('should get an image uri and return image height based on its ratio', () => {
      const { result } = renderHook(() =>
        useImageHeightBasedOnRatio({ uri: 'test' }),
      );

      expect(result.current).toEqual(expected);
    });

    test('should get an image file and return image height based on its ratio', () => {
      const { result } = renderHook(() =>
        useImageHeightBasedOnRatio(require('')),
      );

      expect(result.current).toEqual(expected);
    });
  });
});
