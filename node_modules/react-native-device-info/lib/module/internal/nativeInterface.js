import { Platform, NativeModules } from 'react-native';
let RNDeviceInfo = NativeModules.RNDeviceInfo; // @ts-ignore

if (Platform.OS === 'web' || Platform.OS === 'dom') {
  RNDeviceInfo = require('../web');
}

if (!RNDeviceInfo) {
  // Produce an error if we don't have the native module
  if (Platform.OS === 'android' || Platform.OS === 'ios' || Platform.OS === 'web' || // @ts-ignore
  Platform.OS === 'dom') {
    throw new Error("@react-native-community/react-native-device-info: NativeModule.RNDeviceInfo is null. To fix this issue try these steps:\n  \u2022 For react-native <= 0.59: Run `react-native link react-native-device-info` in the project root.\n  \u2022 Rebuild and re-run the app.\n  \u2022 If you are using CocoaPods on iOS, run `pod install` in the `ios` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.\n  If none of these fix the issue, please open an issue on the Github repository: https://github.com/react-native-community/react-native-device-info");
  }
}

export default RNDeviceInfo;
//# sourceMappingURL=nativeInterface.js.map