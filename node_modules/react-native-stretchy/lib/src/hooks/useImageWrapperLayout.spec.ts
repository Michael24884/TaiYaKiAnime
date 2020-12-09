import { renderHook, act } from '@testing-library/react-hooks';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { useImageWrapperLayout } from './useImageWrapperLayout';

describe('Hooks', () => {
  describe('useImageWrapperLayout', () => {
    test('should update imageWrapperLayout', () => {
      const { result } = renderHook(() => useImageWrapperLayout());

      const expected: LayoutRectangle = { width: 100, height: 100, x: 0, y: 0 };
      const event: LayoutChangeEvent = {
        nativeEvent: { layout: expected },
      };

      act(() => result.current[1](event));

      expect(result.current[0]).toStrictEqual(expected);
    });
  });
});
