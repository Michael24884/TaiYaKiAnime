export const MOCK_IMAGE_WIDTH = 300;
export const MOCK_IMAGE_HEIGHT = 500;

jest.mock('react-native/Libraries/Image/Image', () => {
  const actualImage = jest.requireActual('react-native/Libraries/Image/Image');

  return {
    ...actualImage,
    getSize: (
      uri: string,
      success: (width: number, height: number) => void,
      failure: () => void,
    ) => success(MOCK_IMAGE_WIDTH, MOCK_IMAGE_HEIGHT),
    resolveAssetSource: (source: any) => {
      return {
        width: MOCK_IMAGE_WIDTH,
        height: MOCK_IMAGE_HEIGHT,
      };
    },
  };
});