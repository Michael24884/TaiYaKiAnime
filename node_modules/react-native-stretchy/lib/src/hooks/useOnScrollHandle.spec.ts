import { renderHook, act } from '@testing-library/react-hooks';
import { LayoutChangeEvent, LayoutRectangle } from 'react-native';
import { useOnScrollHandle } from './useOnScrollHandle';
import mockScrollEvent from '../../helpers/scrollEventMock';

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

describe('Hooks', () => {
  describe('useOnScrollHandle', () => {
    const expectedImageWrapperLayout: LayoutRectangle = {
      width: 100,
      height: 100,
      x: 0,
      y: 0,
    };

    test('should call listener with correct params before reaching to the bottom of header', () => {
      const listener = jest.fn(() => {});
      const { result } = renderHook(() => useOnScrollHandle(listener));
      const layoutEvent: LayoutChangeEvent = {
        nativeEvent: { layout: expectedImageWrapperLayout },
      };
      const scrollEvent = mockScrollEvent();

      act(() => result.current.onImageWrapperLayout(layoutEvent));
      act(() => result.current.onScroll(scrollEvent));

      expect(listener).toHaveBeenCalledWith(50, false);
    });

    test('should call listener with correct params after reaching to the bottom of header', () => {
      const listener = jest.fn(() => {});
      const { result } = renderHook(() => useOnScrollHandle(listener));
      const layoutEvent: LayoutChangeEvent = {
        nativeEvent: { layout: expectedImageWrapperLayout },
      };
      const scrollEvent = mockScrollEvent({ x: 0, y: 100 });

      act(() => result.current.onImageWrapperLayout(layoutEvent));
      act(() => result.current.onScroll(scrollEvent));

      expect(listener).toHaveBeenCalledWith(100, true);
    });
  });
});
