/*!
 * @license
 * EME Encryption Scheme Polyfill
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// This special header is retained in minified bundle, and only adds ~120 bytes.

/**
 * A polyfill to add support for EncryptionScheme queries in EME.
 *
 * Because this polyfill can't know what schemes the UA or CDM actually support,
 * it assumes support for the historically-supported schemes of each well-known
 * key system.
 *
 * In source form, this is compatible with the Closure Compiler, CommonJS, and
 * AMD module formats.  It can also be directly included via a script tag.
 *
 * The minified bundle is a standalone module compatible with the CommonJS and
 * AMD module formats, and can also be directly included via a script tag.
 *
 * @see https://wicg.github.io/encrypted-media-encryption-scheme/
 * @see https://github.com/w3c/encrypted-media/pull/457
 * @export
 */
class EmeEncryptionSchemePolyfill {
  /**
   * Installs the polyfill.  To avoid the possibility of extra user prompts,
   * this will shim EME so long as it exists, without checking support for
   * encryptionScheme upfront.  The support check will happen on-demand the
   * first time EME is used.
   *
   * @export
   */
  static install() {
    if (EmeEncryptionSchemePolyfill.originalRMKSA_) {
      console.debug('EmeEncryptionSchemePolyfill: Already installed.');
      return;
    }
    if (!navigator.requestMediaKeySystemAccess ||
        !MediaKeySystemAccess.prototype.getConfiguration) {
      console.debug('EmeEncryptionSchemePolyfill: EME not found');
      // No EME.
      return;
    }

    // Save the original.
    EmeEncryptionSchemePolyfill.originalRMKSA_ =
        navigator.requestMediaKeySystemAccess;

    // Patch in a method which will check for support on the first call.
    console.debug('EmeEncryptionSchemePolyfill: ' +
        'Waiting to detect encryptionScheme support.');
    navigator.requestMediaKeySystemAccess =
        EmeEncryptionSchemePolyfill.probeRMKSA_;
  }

  /**
   * A shim for navigator.requestMediaKeySystemAccess to check for
   * encryptionScheme support.  Only used until we know if the browser has
   * native support for the encryptionScheme field.
   *
   * @this {Navigator}
   * @param {string} keySystem The key system ID.
   * @param {!Array.<!MediaKeySystemConfiguration>} supportedConfigurations An
   *   array of supported configurations the application can use.
   * @return {!Promise.<!MediaKeySystemAccess>} A Promise to a
   *   MediaKeySystemAccess instance.
   * @private
   */
  static async probeRMKSA_(keySystem, supportedConfigurations) {
    console.assert(this == navigator,
        'bad "this" for requestMediaKeySystemAccess');

    // Call the original version.  If the call succeeds, we look at the result
    // to decide if the encryptionScheme field is supported or not.
    const mediaKeySystemAccess =
        await EmeEncryptionSchemePolyfill.originalRMKSA_.call(
            this, keySystem, supportedConfigurations);

    if (hasEncryptionScheme(mediaKeySystemAccess)) {
      // The browser supports the encryptionScheme field!
      // No need for a patch.  Revert back to the original implementation.
      console.debug('EmeEncryptionSchemePolyfill: ' +
          'Native encryptionScheme support found.');
      // eslint-disable-next-line require-atomic-updates
      navigator.requestMediaKeySystemAccess =
          EmeEncryptionSchemePolyfill.originalRMKSA_;
      // Return the results, which are completely valid.
      return mediaKeySystemAccess;
    }

    // If we land here, the browser does _not_ support the encryptionScheme
    // field.  So we install another patch to check the encryptionScheme field
    // in future calls.
    console.debug('EmeEncryptionSchemePolyfill: ' +
        'No native encryptionScheme support found. '+
        'Patching encryptionScheme support.');
    // eslint-disable-next-line require-atomic-updates
    navigator.requestMediaKeySystemAccess =
        EmeEncryptionSchemePolyfill.polyfillRMKSA_;

    // The results we have may not be valid.  Run the query again through our
    // polyfill.
    return EmeEncryptionSchemePolyfill.polyfillRMKSA_.call(
        this, keySystem, supportedConfigurations);
  }

  /**
   * A polyfill for navigator.requestMediaKeySystemAccess to handle the
   * encryptionScheme field in browsers that don't support it.  It uses the
   * user-agent string to guess what encryption schemes are supported, then
   * those guesses are used to filter videoCapabilities and audioCapabilities
   * and reject unsupported schemes.
   *
   * @this {Navigator}
   * @param {string} keySystem The key system ID.
   * @param {!Array.<!MediaKeySystemConfiguration>} supportedConfigurations An
   *   array of supported configurations the application can use.
   * @return {!Promise.<!MediaKeySystemAccess>} A Promise to a
   *   MediaKeySystemAccess instance.
   * @private
   */
  static async polyfillRMKSA_(keySystem, supportedConfigurations) {
    console.assert(this == navigator,
        'bad "this" for requestMediaKeySystemAccess');

    const supportedScheme = guessSupportedScheme(keySystem);

    // Filter the application's configurations based on our guess of what
    // encryption scheme is supported.
    const filteredSupportedConfigurations = [];
    for (const configuration of supportedConfigurations) {
      const filteredVideoCapabilities =
          EmeEncryptionSchemePolyfill.filterCapabilities_(
              configuration.videoCapabilities, supportedScheme);
      const filteredAudioCapabilities =
          EmeEncryptionSchemePolyfill.filterCapabilities_(
              configuration.audioCapabilities, supportedScheme);

      if (configuration.videoCapabilities &&
          configuration.videoCapabilities.length &&
          !filteredVideoCapabilities.length) {
        // We eliminated all of the video capabilities, so this configuration
        // is unusable.
      } else if (configuration.audioCapabilities &&
          configuration.audioCapabilities.length &&
          !filteredAudioCapabilities.length) {
        // We eliminated all of the audio capabilities, so this configuration
        // is unusable.
      } else {
        // Recreate a clone of the configuration and modify that.  This way, we
        // don't modify the application-provided config objects.
        /** @type {!MediaKeySystemConfiguration} */
        const clonedConfiguration = Object.assign({}, configuration);
        clonedConfiguration.videoCapabilities = filteredVideoCapabilities;
        clonedConfiguration.audioCapabilities = filteredAudioCapabilities;
        filteredSupportedConfigurations.push(clonedConfiguration);
      }
    }

    if (!filteredSupportedConfigurations.length) {
      // None of the application's configurations passed our encryptionScheme
      // filters, so this request fails.

      // As spec'd, this should be a DOMException, but there is not a public
      // constructor for this in all browsers.  This should be close enough for
      // most applications.
      const unsupportedError = new Error(
          'Unsupported keySystem or supportedConfigurations.');
      unsupportedError.name = 'NotSupportedError';
      unsupportedError['code'] = DOMException.NOT_SUPPORTED_ERR;
      throw unsupportedError;
    }

    // At this point, we have some filtered configurations that we think could
    // work.  Pass this subset to the native version of RMKSA.
    const mediaKeySystemAccess =
        await EmeEncryptionSchemePolyfill.originalRMKSA_.call(
            this, keySystem, filteredSupportedConfigurations);
    // Wrap the MKSA object in ours to provide the missing field in the
    // returned configuration.
    return new EmeEncryptionSchemePolyfillMediaKeySystemAccess(
        mediaKeySystemAccess, supportedScheme);
  }

  /**
   * Filters out capabilities that don't match the supported encryption scheme.
   *
   * @param {!Array.<!MediaKeySystemMediaCapability>|undefined} capabilities
   *   An array of capabilities, or null or undefined.
   * @param {?string} supportedScheme The encryption scheme that we think is
   *   supported by the key system.
   * @return {!Array.<!MediaKeySystemMediaCapability>|undefined} A filtered
   *   array of capabilities based on |supportedScheme|.  May be undefined if
   *   the input was undefined.
   * @private
   */
  static filterCapabilities_(capabilities, supportedScheme) {
    if (!capabilities) {
      return capabilities;
    }

    return capabilities.filter((capability) => {
      // No specific scheme always works.  In addition, accept the specific
      // scheme we guessed for this UA.
      return !capability['encryptionScheme'] ||
          capability['encryptionScheme'] == supportedScheme;
    });
  }
}

/**
 * A polyfill to add support for EncryptionScheme queries in MediaCapabilities.
 *
 * Because this polyfill can't know what schemes the UA or CDM actually support,
 * it assumes support for the historically-supported schemes of each well-known
 * key system.
 *
 * In source form, this is compatible with the Closure Compiler, CommonJS, and
 * AMD module formats.  It can also be directly included via a script tag.
 *
 * The minified bundle is a standalone module compatible with the CommonJS and
 * AMD module formats, and can also be directly included via a script tag.
 *
 * @see https://wicg.github.io/encrypted-media-encryption-scheme/
 * @see https://github.com/w3c/encrypted-media/pull/457
 * @export
 */
class McEncryptionSchemePolyfill {
  /**
   * Installs the polyfill.  To avoid the possibility of extra user prompts,
   * this will shim MC so long as it exists, without checking support for
   * encryptionScheme upfront.  The support check will happen on-demand the
   * first time MC is used.
   *
   * @export
   */
  static install() {
    if (!navigator.mediaCapabilities) {
      console.debug('McEncryptionSchemePolyfill: MediaCapabilities not found');
      // No MediaCapabilities.
      return;
    }

    // Save the original.
    McEncryptionSchemePolyfill.originalDecodingInfo_ =
        navigator.mediaCapabilities.decodingInfo;

    // Patch in a method which will check for support on the first call.
    console.debug('McEncryptionSchemePolyfill: ' +
        'Waiting to detect encryptionScheme support.');
    navigator.mediaCapabilities.decodingInfo =
        McEncryptionSchemePolyfill.probeDecodingInfo_;
  }

  /**
   * A shim for mediaCapabilities.decodingInfo to check for encryptionScheme
   * support.  Only used until we know if the browser has native support for the
   * encryptionScheme field.
   *
   * @this {MediaCapabilities}
   * @param {!MediaDecodingConfiguration} requestedConfiguration The requested
   *   decoding configuration.
   * @return {!Promise.<!MediaCapabilitiesDecodingInfo>} A Promise to a result
   *   describing the capabilities of the browser in the request configuration.
   * @private
   */
  static async probeDecodingInfo_(requestedConfiguration) {
    console.assert(this == navigator.mediaCapabilities,
        'bad "this" for decodingInfo');

    // Call the original version.  If the call succeeds, we look at the result
    // to decide if the encryptionScheme field is supported or not.
    const capabilities =
        await McEncryptionSchemePolyfill.originalDecodingInfo_.call(
            this, requestedConfiguration);

    if (!requestedConfiguration.keySystemConfiguration) {
      // This was not a query regarding encrypted content.  The results are
      // valid, but won't tell us anything about native support for
      // encryptionScheme.  Just return the results.
      return capabilities;
    }

    const mediaKeySystemAccess = capabilities.keySystemAccess;

    if (hasEncryptionScheme(mediaKeySystemAccess)) {
      // The browser supports the encryptionScheme field!
      // No need for a patch.  Revert back to the original implementation.
      console.debug('McEncryptionSchemePolyfill: ' +
          'Native encryptionScheme support found.');
      // eslint-disable-next-line require-atomic-updates
      navigator.mediaCapabilities.decodingInfo =
          McEncryptionSchemePolyfill.originalDecodingInfo_;
      // Return the results, which are completely valid.
      return capabilities;
    }

    // If we land here, the browser does _not_ support the encryptionScheme
    // field.  So we install another patch to check the encryptionScheme field
    // in future calls.
    console.debug('McEncryptionSchemePolyfill: ' +
        'No native encryptionScheme support found. '+
        'Patching encryptionScheme support.');
    // eslint-disable-next-line require-atomic-updates
    navigator.mediaCapabilities.decodingInfo =
        McEncryptionSchemePolyfill.polyfillDecodingInfo_;

    // The results we have may not be valid.  Run the query again through our
    // polyfill.
    return McEncryptionSchemePolyfill.polyfillDecodingInfo_.call(
        this, requestedConfiguration);
  }

  /**
   * A polyfill for mediaCapabilities.decodingInfo to handle the
   * encryptionScheme field in browsers that don't support it.  It uses the
   * user-agent string to guess what encryption schemes are supported, then
   * those guesses are used to reject unsupported schemes.
   *
   * @this {MediaCapabilities}
   * @param {!MediaDecodingConfiguration} requestedConfiguration The requested
   *   decoding configuration.
   * @return {!Promise.<!MediaCapabilitiesDecodingInfo>} A Promise to a result
   *   describing the capabilities of the browser in the request configuration.
   * @private
   */
  static async polyfillDecodingInfo_(requestedConfiguration) {
    console.assert(this == navigator.mediaCapabilities,
        'bad "this" for decodingInfo');

    let supportedScheme = null;

    if (requestedConfiguration.keySystemConfiguration) {
      const keySystemConfig = requestedConfiguration.keySystemConfiguration;

      const keySystem = keySystemConfig.keySystem;

      const audioScheme = keySystemConfig.audio &&
          keySystemConfig.audio.encryptionScheme;
      const videoScheme = keySystemConfig.video &&
          keySystemConfig.video.encryptionScheme;

      supportedScheme = guessSupportedScheme(keySystem);

      const notSupportedResult = {
        powerEfficient: false,
        smooth: false,
        supported: false,
        keySystemAccess: null,
        configuration: requestedConfiguration,
      };

      if (audioScheme && audioScheme != supportedScheme) {
        return notSupportedResult;
      }
      if (videoScheme && videoScheme != supportedScheme) {
        return notSupportedResult;
      }
    }

    // At this point, either it's unencrypted or we assume the encryption scheme
    // is supported.  So delegate to the original decodingInfo() method.
    const capabilities =
        await McEncryptionSchemePolyfill.originalDecodingInfo_.call(
            this, requestedConfiguration);

    if (capabilities.keySystemAccess) {
      // If the result is supported and encrypted, this will be a
      // MediaKeySystemAccess instance.  Wrap the MKSA object in ours to provide
      // the missing field in the returned configuration.
      capabilities.keySystemAccess =
          new EmeEncryptionSchemePolyfillMediaKeySystemAccess(
              capabilities.keySystemAccess, supportedScheme);
    }

    return capabilities;
  }
}

/**
 * A wrapper around MediaKeySystemAccess that adds encryptionScheme
 *   fields to the configuration, to emulate what a browser with native support
 *   for this field would do.
 *
 * @see https://github.com/w3c/encrypted-media/pull/457
 * @see https://github.com/WICG/encrypted-media-encryption-scheme/issues/13
 * @implements {MediaKeySystemAccess}
 */
class EmeEncryptionSchemePolyfillMediaKeySystemAccess {
  /**
   * @param {!MediaKeySystemAccess} mksa A native MediaKeySystemAccess instance
   *   to wrap.
   * @param {?string} scheme The encryption scheme to add to the configuration.
   */
  constructor(mksa, scheme) {
    /**
     * @const {!MediaKeySystemAccess}
     * @private
     */
    this.mksa_ = mksa;

    /**
     * @const {?string}
     * @private
     */
    this.scheme_ = scheme;

    /** @const {string} */
    this.keySystem = mksa.keySystem;
  }

  /** @override */
  getConfiguration() {
    // A browser which supports the encryptionScheme field would always return
    // that field in the resulting configuration.  So here, we emulate that.
    const configuration = this.mksa_.getConfiguration();

    if (configuration.videoCapabilities) {
      for (const capability of configuration.videoCapabilities) {
        capability['encryptionScheme'] = this.scheme_;
      }
    }

    if (configuration.audioCapabilities) {
      for (const capability of configuration.audioCapabilities) {
        capability['encryptionScheme'] = this.scheme_;
      }
    }

    return configuration;
  }

  /** @override */
  createMediaKeys() {
    return this.mksa_.createMediaKeys();
  }
}

/**
 * Guess the supported encryption scheme for the key system.
 *
 * @param {string} keySystem The key system ID.
 * @return {?string} A guess at the encryption scheme this key system
 *   supports.
 */
function guessSupportedScheme(keySystem) {
  if (keySystem.startsWith('com.widevine')) {
    return 'cenc';
  } else if (keySystem.startsWith('com.microsoft')) {
    return 'cenc';
  } else if (keySystem.startsWith('com.adobe')) {
    return 'cenc';
  } else if (keySystem.startsWith('org.w3')) {
    return 'cenc';
  } else if (keySystem.startsWith('com.apple')) {
    return 'cbcs-1-9';
  }

  // We don't have this key system in our map!

  // Log a warning.  The only way the request will succeed now is if the
  // app doesn't specify an encryption scheme in their own configs.
  // Use bracket notation to keep this from being stripped from the build.
  console['warn']('EmeEncryptionSchemePolyfill: Unknown key system:',
      keySystem, 'Please contribute!');

  return null;
}

/**
 * @param {?MediaKeySystemAccess} mediaKeySystemAccess A native
 *   MediaKeySystemAccess instance from the browser.
 * @return {boolean} True if browser natively supports encryptionScheme.
 */
function hasEncryptionScheme(mediaKeySystemAccess) {
  const configuration = mediaKeySystemAccess.getConfiguration();

  // It doesn't matter which capability we look at.  For this check, they
  // should all produce the same result.
  const firstVideoCapability =
      configuration.videoCapabilities && configuration.videoCapabilities[0];
  const firstAudioCapability =
      configuration.audioCapabilities && configuration.audioCapabilities[0];
  const firstCapability = firstVideoCapability || firstAudioCapability;

  // If supported by the browser, the encryptionScheme field must appear in
  // the returned configuration, regardless of whether or not it was
  // specified in the supportedConfigurations given by the application.
  if (firstCapability && firstCapability['encryptionScheme'] !== undefined) {
    return true;
  }
  return false;
}

/**
 * The original requestMediaKeySystemAccess, before we patched it.
 *
 * @type {
 *   function(this:Navigator,
 *     string,
 *     !Array.<!MediaKeySystemConfiguration>
 *   ):!Promise.<!MediaKeySystemAccess>
 * }
 * @private
 */
EmeEncryptionSchemePolyfill.originalRMKSA_;

/**
 * The original decodingInfo, before we patched it.
 *
 * @type {
 *   function(this:MediaCapabilities,
 *     !MediaDecodingConfiguration
 *   ):!Promise.<!MediaCapabilitiesDecodingInfo>
 * }
 * @private
 */
McEncryptionSchemePolyfill.originalDecodingInfo_;

/**
 * A single entry point for both polyfills (EME & MC).
 *
 * @export
 */
class EncryptionSchemePolyfills {
  /**
   * Installs both polyfills (EME & MC).
   *
   * @export
   */
  static install() {
    EmeEncryptionSchemePolyfill.install();
    McEncryptionSchemePolyfill.install();
  }
}

// Support for CommonJS and AMD module formats.
/** @suppress {undefinedVars} */
(() => {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = EncryptionSchemePolyfills;
  }
})();
