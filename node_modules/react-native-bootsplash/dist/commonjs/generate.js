"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generate = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _jimp = _interopRequireDefault(require("jimp"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logoFileName = "bootsplash_logo";
const xcassetName = "BootSplashLogo";
const androidColorName = "bootsplash_background";
const androidColorRegex = /<color name="bootsplash_background">#\w+<\/color>/g;
const ContentsJson = "{\n  \"images\": [\n    {\n      \"idiom\": \"universal\",\n      \"filename\": \"".concat(logoFileName, ".png\",\n      \"scale\": \"1x\"\n    },\n    {\n      \"idiom\": \"universal\",\n      \"filename\": \"").concat(logoFileName, "@2x.png\",\n      \"scale\": \"2x\"\n    },\n    {\n      \"idiom\": \"universal\",\n      \"filename\": \"").concat(logoFileName, "@3x.png\",\n      \"scale\": \"3x\"\n    }\n  ],\n  \"info\": {\n    \"version\": 1,\n    \"author\": \"xcode\"\n  }\n}\n");

const getStoryboard = ({
  height,
  width,
  backgroundColor: hex
}) => {
  const r = (parseInt(hex[1] + hex[2], 16) / 255).toPrecision(15);
  const g = (parseInt(hex[3] + hex[4], 16) / 255).toPrecision(15);
  const b = (parseInt(hex[5] + hex[6], 16) / 255).toPrecision(15);
  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<document type=\"com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB\" version=\"3.0\" toolsVersion=\"17147\" targetRuntime=\"iOS.CocoaTouch\" propertyAccessControl=\"none\" useAutolayout=\"YES\" launchScreen=\"YES\" useTraitCollections=\"YES\" useSafeAreas=\"YES\" colorMatched=\"YES\" initialViewController=\"01J-lp-oVM\">\n    <device id=\"retina4_7\" orientation=\"portrait\" appearance=\"light\"/>\n    <dependencies>\n        <deployment identifier=\"iOS\"/>\n        <plugIn identifier=\"com.apple.InterfaceBuilder.IBCocoaTouchPlugin\" version=\"17120\"/>\n        <capability name=\"Safe area layout guides\" minToolsVersion=\"9.0\"/>\n        <capability name=\"documents saved in the Xcode 8 format\" minToolsVersion=\"8.0\"/>\n    </dependencies>\n    <scenes>\n        <!--View Controller-->\n        <scene sceneID=\"EHf-IW-A2E\">\n            <objects>\n                <viewController id=\"01J-lp-oVM\" sceneMemberID=\"viewController\">\n                    <view key=\"view\" autoresizesSubviews=\"NO\" userInteractionEnabled=\"NO\" contentMode=\"scaleToFill\" id=\"Ze5-6b-2t3\">\n                        <rect key=\"frame\" x=\"0.0\" y=\"0.0\" width=\"375\" height=\"667\"/>\n                        <autoresizingMask key=\"autoresizingMask\"/>\n                        <subviews>\n                            <imageView autoresizesSubviews=\"NO\" clipsSubviews=\"YES\" userInteractionEnabled=\"NO\" contentMode=\"scaleAspectFit\" image=\"BootSplashLogo\" translatesAutoresizingMaskIntoConstraints=\"NO\" id=\"3lX-Ut-9ad\">\n                                <rect key=\"frame\" x=\"".concat((375 - width) / 2, "\" y=\"").concat((667 - height) / 2, "\" width=\"").concat(width, "\" height=\"").concat(height, "\"/>\n                                <accessibility key=\"accessibilityConfiguration\">\n                                    <accessibilityTraits key=\"traits\" image=\"YES\" notEnabled=\"YES\"/>\n                                </accessibility>\n                            </imageView>\n                        </subviews>\n                        <viewLayoutGuide key=\"safeArea\" id=\"Bcu-3y-fUS\"/>\n                        <color key=\"backgroundColor\" red=\"").concat(r, "\" green=\"").concat(g, "\" blue=\"").concat(b, "\" alpha=\"1\" colorSpace=\"custom\" customColorSpace=\"sRGB\"/>\n                        <accessibility key=\"accessibilityConfiguration\">\n                            <accessibilityTraits key=\"traits\" notEnabled=\"YES\"/>\n                        </accessibility>\n                        <constraints>\n                            <constraint firstItem=\"3lX-Ut-9ad\" firstAttribute=\"centerX\" secondItem=\"Ze5-6b-2t3\" secondAttribute=\"centerX\" id=\"Fh9-Fy-1nT\"/>\n                            <constraint firstItem=\"3lX-Ut-9ad\" firstAttribute=\"centerY\" secondItem=\"Ze5-6b-2t3\" secondAttribute=\"centerY\" id=\"nvB-Ic-PnI\"/>\n                        </constraints>\n                    </view>\n                </viewController>\n                <placeholder placeholderIdentifier=\"IBFirstResponder\" id=\"iYj-Kq-Ea1\" userLabel=\"First Responder\" sceneMemberID=\"firstResponder\"/>\n            </objects>\n            <point key=\"canvasLocation\" x=\"0.0\" y=\"0.0\"/>\n        </scene>\n    </scenes>\n    <resources>\n        <image name=\"").concat(xcassetName, "\" width=\"").concat(width, "\" height=\"").concat(height, "\"/>\n    </resources>\n</document>\n");
};

const bootSplashXml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n\n<layer-list xmlns:android=\"http://schemas.android.com/apk/res/android\" android:opacity=\"opaque\">\n    <item android:drawable=\"@color/".concat(androidColorName, "\" />\n\n    <item>\n        <bitmap android:src=\"@mipmap/").concat(logoFileName, "\" android:gravity=\"center\" />\n    </item>\n</layer-list>\n");

const log = (text, dim = false) => {
  console.log(dim ? _chalk.default.dim(text) : text);
};

const isValidHexadecimal = value => /^#?([0-9A-F]{3}){1,2}$/i.test(value);

const toFullHexadecimal = hex => {
  const prefixed = hex[0] === "#" ? hex : "#".concat(hex);
  const up = prefixed.toUpperCase();
  return up.length === 4 ? "#" + up[1] + up[1] + up[2] + up[2] + up[3] + up[3] : up;
};

const generate = async ({
  android,
  ios,
  workingDirectory,
  logoPath,
  backgroundColor,
  logoWidth,
  assetsPath
}) => {
  if (!isValidHexadecimal(backgroundColor)) {
    throw new Error("--background-color value is not a valid hexadecimal color.");
  }

  const image = await _jimp.default.read(logoPath);
  const backgroundColorHex = toFullHexadecimal(backgroundColor);
  const images = [];

  const getHeight = size => Math.ceil(size * (image.bitmap.height / image.bitmap.width));

  const width = {
    "@1x": logoWidth,
    "@1,5x": logoWidth * 1.5,
    "@2x": logoWidth * 2,
    "@3x": logoWidth * 3,
    "@4x": logoWidth * 4
  };
  const height = {
    "@1x": getHeight(width["@1x"]),
    "@1,5x": getHeight(width["@1,5x"]),
    "@2x": getHeight(width["@2x"]),
    "@3x": getHeight(width["@3x"]),
    "@4x": getHeight(width["@4x"])
  };

  if (assetsPath && _fsExtra.default.existsSync(assetsPath)) {
    images.push({
      filePath: _path.default.resolve(assetsPath, logoFileName + ".png"),
      width: width["@1x"],
      height: height["@1x"]
    }, {
      filePath: _path.default.resolve(assetsPath, logoFileName + "@1,5x.png"),
      width: width["@1,5x"],
      height: height["@1,5x"]
    }, {
      filePath: _path.default.resolve(assetsPath, logoFileName + "@2x.png"),
      width: width["@2x"],
      height: height["@2x"]
    }, {
      filePath: _path.default.resolve(assetsPath, logoFileName + "@3x.png"),
      width: width["@3x"],
      height: height["@3x"]
    }, {
      filePath: _path.default.resolve(assetsPath, logoFileName + "@4x.png"),
      width: width["@4x"],
      height: height["@4x"]
    });
  }

  if (android) {
    const appPath = android.appName ? _path.default.resolve(android.sourceDir, android.appName) : _path.default.resolve(android.sourceDir); // @react-native-community/cli 2.x & 3.x support

    const resPath = _path.default.resolve(appPath, "src", "main", "res");

    const drawablePath = _path.default.resolve(resPath, "drawable");

    const valuesPath = _path.default.resolve(resPath, "values");

    _fsExtra.default.ensureDirSync(drawablePath);

    _fsExtra.default.ensureDirSync(valuesPath);

    const bootSplashXmlPath = _path.default.resolve(drawablePath, "bootsplash.xml");

    _fsExtra.default.writeFileSync(bootSplashXmlPath, bootSplashXml, "utf-8");

    log("\u2728  ".concat(_path.default.relative(workingDirectory, bootSplashXmlPath)), true);

    const colorsXmlPath = _path.default.resolve(valuesPath, "colors.xml");

    const colorsXmlEntry = "<color name=\"".concat(androidColorName, "\">").concat(backgroundColorHex, "</color>");

    if (_fsExtra.default.existsSync(colorsXmlPath)) {
      const colorsXml = _fsExtra.default.readFileSync(colorsXmlPath, "utf-8");

      if (colorsXml.match(androidColorRegex)) {
        _fsExtra.default.writeFileSync(colorsXmlPath, colorsXml.replace(androidColorRegex, colorsXmlEntry), "utf-8");
      } else {
        _fsExtra.default.writeFileSync(colorsXmlPath, colorsXml.replace(/<\/resources>/g, "    ".concat(colorsXmlEntry, "\n</resources>")), "utf-8");
      }

      log("\u270F\uFE0F   ".concat(_path.default.relative(workingDirectory, colorsXmlPath)), true);
    } else {
      _fsExtra.default.writeFileSync(colorsXmlPath, "<resources>\n    ".concat(colorsXmlEntry, "\n</resources>\n"), "utf-8");

      log("\u2728  ".concat(_path.default.relative(workingDirectory, colorsXmlPath)), true);
    }

    images.push({
      filePath: _path.default.resolve(resPath, "mipmap-mdpi", logoFileName + ".png"),
      width: width["@1x"],
      height: height["@1x"]
    }, {
      filePath: _path.default.resolve(resPath, "mipmap-hdpi", logoFileName + ".png"),
      width: width["@1,5x"],
      height: height["@1,5x"]
    }, {
      filePath: _path.default.resolve(resPath, "mipmap-xhdpi", logoFileName + ".png"),
      width: width["@2x"],
      height: height["@2x"]
    }, {
      filePath: _path.default.resolve(resPath, "mipmap-xxhdpi", logoFileName + ".png"),
      width: width["@3x"],
      height: height["@3x"]
    }, {
      filePath: _path.default.resolve(resPath, "mipmap-xxxhdpi", logoFileName + ".png"),
      width: width["@4x"],
      height: height["@4x"]
    });
  }

  if (ios) {
    const projectPath = ios.projectPath.replace(/.xcodeproj$/, "");

    const imagesPath = _path.default.resolve(projectPath, "Images.xcassets");

    if (_fsExtra.default.existsSync(projectPath)) {
      const storyboardPath = _path.default.resolve(projectPath, "BootSplash.storyboard");

      _fsExtra.default.writeFileSync(storyboardPath, getStoryboard({
        height: height["@1x"],
        width: width["@1x"],
        backgroundColor: backgroundColorHex
      }), "utf-8");

      log("\u2728  ".concat(_path.default.relative(workingDirectory, storyboardPath)), true);
    } else {
      log("No \"".concat(projectPath, "\" directory found. Skipping iOS storyboard generation\u2026"));
    }

    if (_fsExtra.default.existsSync(imagesPath)) {
      const imageSetPath = _path.default.resolve(imagesPath, xcassetName + ".imageset");

      _fsExtra.default.ensureDirSync(imageSetPath);

      _fsExtra.default.writeFileSync(_path.default.resolve(imageSetPath, "Contents.json"), ContentsJson, "utf-8");

      images.push({
        filePath: _path.default.resolve(imageSetPath, logoFileName + ".png"),
        width: width["@1x"],
        height: height["@1x"]
      }, {
        filePath: _path.default.resolve(imageSetPath, logoFileName + "@2x.png"),
        width: width["@2x"],
        height: height["@2x"]
      }, {
        filePath: _path.default.resolve(imageSetPath, logoFileName + "@3x.png"),
        width: width["@3x"],
        height: height["@3x"]
      });
    } else {
      log("No \"".concat(imagesPath, "\" directory found. Skipping iOS images generation\u2026"));
    }
  }

  await Promise.all(images.map(({
    filePath,
    width,
    height
  }) => image.clone().cover(width, height).writeAsync(filePath).then(() => {
    log("\u2728  ".concat(_path.default.relative(workingDirectory, filePath), " (").concat(width, "x").concat(height, ")"), true);
  })));
  log("\u2705  Done! Thanks for using ".concat(_chalk.default.underline("react-native-bootsplash"), "."));
};

exports.generate = generate;
//# sourceMappingURL=generate.js.map