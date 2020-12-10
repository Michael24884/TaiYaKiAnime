import { Platform } from 'react-native';
// centralized memo object
let memo = {};
export function clearMemo() {
  memo = {};
}
/**
 * function returns the proper getter based current platform X supported platforms
 * @param supportedPlatforms array of supported platforms (OS)
 * @param getter desired function used to get info
 * @param defaultGetter getter that returns a default value if desired getter is not supported by current platform
 */

function getSupportedFunction(supportedPlatforms, getter, defaultGetter) {
  let supportedMap = {};
  supportedPlatforms.filter(key => Platform.OS == key).forEach(key => supportedMap[key] = getter);
  return Platform.select({ ...supportedMap,
    default: defaultGetter
  });
}
/**
 * function used to get desired info synchronously — with optional memoization
 * @param param0
 */


export function getSupportedPlatformInfoSync({
  getter,
  supportedPlatforms,
  defaultValue,
  memoKey
}) {
  if (memoKey && memo[memoKey] != undefined) {
    return memo[memoKey];
  } else {
    const output = getSupportedFunction(supportedPlatforms, getter, () => defaultValue)();

    if (memoKey) {
      memo[memoKey] = output;
    }

    return output;
  }
}
/**
 * function used to get desired info asynchronously — with optional memoization
 * @param param0
 */

export async function getSupportedPlatformInfoAsync({
  getter,
  supportedPlatforms,
  defaultValue,
  memoKey
}) {
  if (memoKey && memo[memoKey] != undefined) {
    return memo[memoKey];
  } else {
    const output = await getSupportedFunction(supportedPlatforms, getter, () => Promise.resolve(defaultValue))();

    if (memoKey) {
      memo[memoKey] = output;
    }

    return output;
  }
}
/**
 * function that returns array of getter functions [async, sync]
 * @param param0
 */

export function getSupportedPlatformInfoFunctions({
  syncGetter,
  ...asyncParams
}) {
  return [() => getSupportedPlatformInfoAsync(asyncParams), () => getSupportedPlatformInfoSync({ ...asyncParams,
    getter: syncGetter
  })];
}
//# sourceMappingURL=supported-platform-info.js.map