"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPowerStateSync = exports.getPowerState = exports.getTotalMemory = exports.getUsedMemory = exports.getMaxMemory = exports.getFreeDiskStorageSync = exports.getFreeDiskStorage = exports.getTotalDiskCapacitySync = exports.getTotalDiskCapacity = exports.getBaseOs = exports.isAirplaneMode = exports.isLocationEnabled = exports.getBatteryLevelSync = exports.getBatteryLevel = exports.isCameraPresentSync = exports.isCameraPresent = exports.isBatteryChargingSync = exports.isBatteryCharging = exports.getUserAgent = exports.getInstallReferrer = exports.getUsedMemorySync = exports.getTotalMemorySync = exports.isLocationEnabledSync = exports.getUserAgentSync = exports.isAirplaneModeSync = exports.getInstallReferrerSync = exports.getMaxMemorySync = void 0;

var _reactNative = require("react-native");

const deviceInfoEmitter = new _reactNative.NativeEventEmitter(_reactNative.NativeModules.RNDeviceInfo);
let batteryCharging = false,
    batteryLevel = -1,
    powerState = {};

const _readPowerState = battery => {
  const {
    level,
    charging,
    chargingtime,
    dischargingtime
  } = battery;
  return {
    batteryLevel: level,
    lowPowerMode: false,
    batteryState: level === 1 ? 'full' : charging ? 'charging' : 'unplugged',
    chargingtime,
    dischargingtime
  };
};

const getMaxMemorySync = () => {
  if (window.performance && window.performance.memory) {
    return window.performance.memory.jsHeapSizeLimit;
  }

  return -1;
};

exports.getMaxMemorySync = getMaxMemorySync;

const getInstallReferrerSync = () => {
  return document.referrer;
};

exports.getInstallReferrerSync = getInstallReferrerSync;

const isAirplaneModeSync = () => {
  return !!navigator.onLine;
};

exports.isAirplaneModeSync = isAirplaneModeSync;

const getUserAgentSync = () => {
  return window.navigator.userAgent;
};

exports.getUserAgentSync = getUserAgentSync;

const isLocationEnabledSync = () => {
  return !!navigator.geolocation;
};

exports.isLocationEnabledSync = isLocationEnabledSync;

const getTotalMemorySync = () => {
  if (navigator.deviceMemory) {
    return navigator.deviceMemory * 1000000000;
  }

  return -1;
};

exports.getTotalMemorySync = getTotalMemorySync;

const getUsedMemorySync = () => {
  if (window.performance && window.performance.memory) {
    return window.performance.memory.usedJSHeapSize;
  }

  return -1;
};

exports.getUsedMemorySync = getUsedMemorySync;

const init = async () => {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    batteryCharging = battery.charging;
    battery.addEventListener('chargingchange', () => {
      const {
        charging
      } = battery;
      batteryCharging = charging;
      powerState = _readPowerState(battery);
      deviceInfoEmitter.emit('RNDeviceInfo_powerStateDidChange', powerState);
    });
    battery.addEventListener('levelchange', () => {
      const {
        level
      } = battery;
      batteryLevel = level;
      powerState = _readPowerState(battery);
      deviceInfoEmitter.emit('RNDeviceInfo_batteryLevelDidChange', level);

      if (level < 0.2) {
        deviceInfoEmitter.emit('RNDeviceInfo_batteryLevelIsLow', level);
      }
    });
  }
};

const getBaseOsSync = () => {
  const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = platform;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
};

init();
/**
 * react-native-web empty polyfill.
 */

const getInstallReferrer = async () => {
  return getInstallReferrerSync();
};

exports.getInstallReferrer = getInstallReferrer;

const getUserAgent = async () => {
  return getUserAgentSync();
};

exports.getUserAgent = getUserAgent;

const isBatteryCharging = async () => {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    return battery.level;
  }

  return false;
};

exports.isBatteryCharging = isBatteryCharging;

const isBatteryChargingSync = () => {
  return batteryCharging;
};

exports.isBatteryChargingSync = isBatteryChargingSync;

const isCameraPresent = async () => {
  if (navigator.getBattery) {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return !!devices.find(d => d.kind === 'videoinput');
  }

  return false;
};

exports.isCameraPresent = isCameraPresent;

const isCameraPresentSync = () => {
  console.log('[react-native-device-info] isCameraPresentSync not supported - please use isCameraPresent');
  return false;
};

exports.isCameraPresentSync = isCameraPresentSync;

const getBatteryLevel = async () => {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    return battery.level;
  }

  return -1;
};

exports.getBatteryLevel = getBatteryLevel;

const getBatteryLevelSync = () => {
  return batteryLevel;
};

exports.getBatteryLevelSync = getBatteryLevelSync;

const isLocationEnabled = async () => {
  return isLocationEnabledSync();
};

exports.isLocationEnabled = isLocationEnabled;

const isAirplaneMode = async () => {
  return isAirplaneModeSync();
};

exports.isAirplaneMode = isAirplaneMode;

const getBaseOs = async () => {
  return getBaseOsSync();
};

exports.getBaseOs = getBaseOs;

const getTotalDiskCapacity = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const {
      quota
    } = await navigator.storage.estimate();
    return quota;
  }

  return -1;
};

exports.getTotalDiskCapacity = getTotalDiskCapacity;

const getTotalDiskCapacitySync = () => {
  console.log('[react-native-device-info] getTotalDiskCapacitySync not supported - please use getTotalDiskCapacity');
  return -1;
};

exports.getTotalDiskCapacitySync = getTotalDiskCapacitySync;

const getFreeDiskStorage = async () => {
  if (navigator.storage && navigator.storage.estimate) {
    const {
      quota,
      usage
    } = await navigator.storage.estimate();
    return quota - usage;
  }

  return -1;
};

exports.getFreeDiskStorage = getFreeDiskStorage;

const getFreeDiskStorageSync = () => {
  console.log('[react-native-device-info] getFreeDiskStorageSync not supported - please use getFreeDiskStorage');
  return -1;
};

exports.getFreeDiskStorageSync = getFreeDiskStorageSync;

const getMaxMemory = async () => {
  return getMaxMemorySync();
};

exports.getMaxMemory = getMaxMemory;

const getUsedMemory = async () => {
  return getUsedMemorySync();
};

exports.getUsedMemory = getUsedMemory;

const getTotalMemory = async () => {
  return getTotalMemorySync();
};

exports.getTotalMemory = getTotalMemory;

const getPowerState = async () => {
  if (navigator.getBattery) {
    const battery = await navigator.getBattery();
    return _readPowerState(battery);
  }

  return {};
};

exports.getPowerState = getPowerState;

const getPowerStateSync = () => {
  return powerState;
};

exports.getPowerStateSync = getPowerStateSync;
//# sourceMappingURL=index.js.map