import { NativeModules } from "react-native";
const NativeModule = NativeModules.RNBootSplash;
export function show(config = {}) {
  return NativeModule.show({
    fade: false,
    ...config
  }.fade).then(() => {});
}
export function hide(config = {}) {
  return NativeModule.hide({
    fade: false,
    ...config
  }.fade).then(() => {});
}
export function getVisibilityStatus() {
  return NativeModule.getVisibilityStatus();
}
export default {
  show,
  hide,
  getVisibilityStatus
};
//# sourceMappingURL=index.js.map