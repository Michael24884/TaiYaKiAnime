import chalk from "chalk";
import fs from "fs-extra";
import jimp from "jimp";
import path from "path";
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
  console.log(dim ? chalk.dim(text) : text);
};

const isValidHexadecimal = value => /^#?([0-9A-F]{3}){1,2}$/i.test(value);

const toFullHexadecimal = hex => {
  const prefixed = hex[0] === "#" ? hex : "#".concat(hex);
  const up = prefixed.toUpperCase();
  return up.length === 4 ? "#" + up[1] + up[1] + up[2] + up[2] + up[3] + up[3] : up;
};

export const generate = async ({
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

  const image = await jimp.read(logoPath);
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

  if (assetsPath && fs.existsSync(assetsPath)) {
    images.push({
      filePath: path.resolve(assetsPath, logoFileName + ".png"),
      width: width["@1x"],
      height: height["@1x"]
    }, {
      filePath: path.resolve(assetsPath, logoFileName + "@1,5x.png"),
      width: width["@1,5x"],
      height: height["@1,5x"]
    }, {
      filePath: path.resolve(assetsPath, logoFileName + "@2x.png"),
      width: width["@2x"],
      height: height["@2x"]
    }, {
      filePath: path.resolve(assetsPath, logoFileName + "@3x.png"),
      width: width["@3x"],
      height: height["@3x"]
    }, {
      filePath: path.resolve(assetsPath, logoFileName + "@4x.png"),
      width: width["@4x"],
      height: height["@4x"]
    });
  }

  if (android) {
    const appPath = android.appName ? path.resolve(android.sourceDir, android.appName) : path.resolve(android.sourceDir); // @react-native-community/cli 2.x & 3.x support

    const resPath = path.resolve(appPath, "src", "main", "res");
    const drawablePath = path.resolve(resPath, "drawable");
    const valuesPath = path.resolve(resPath, "values");
    fs.ensureDirSync(drawablePath);
    fs.ensureDirSync(valuesPath);
    const bootSplashXmlPath = path.resolve(drawablePath, "bootsplash.xml");
    fs.writeFileSync(bootSplashXmlPath, bootSplashXml, "utf-8");
    log("\u2728  ".concat(path.relative(workingDirectory, bootSplashXmlPath)), true);
    const colorsXmlPath = path.resolve(valuesPath, "colors.xml");
    const colorsXmlEntry = "<color name=\"".concat(androidColorName, "\">").concat(backgroundColorHex, "</color>");

    if (fs.existsSync(colorsXmlPath)) {
      const colorsXml = fs.readFileSync(colorsXmlPath, "utf-8");

      if (colorsXml.match(androidColorRegex)) {
        fs.writeFileSync(colorsXmlPath, colorsXml.replace(androidColorRegex, colorsXmlEntry), "utf-8");
      } else {
        fs.writeFileSync(colorsXmlPath, colorsXml.replace(/<\/resources>/g, "    ".concat(colorsXmlEntry, "\n</resources>")), "utf-8");
      }

      log("\u270F\uFE0F   ".concat(path.relative(workingDirectory, colorsXmlPath)), true);
    } else {
      fs.writeFileSync(colorsXmlPath, "<resources>\n    ".concat(colorsXmlEntry, "\n</resources>\n"), "utf-8");
      log("\u2728  ".concat(path.relative(workingDirectory, colorsXmlPath)), true);
    }

    images.push({
      filePath: path.resolve(resPath, "mipmap-mdpi", logoFileName + ".png"),
      width: width["@1x"],
      height: height["@1x"]
    }, {
      filePath: path.resolve(resPath, "mipmap-hdpi", logoFileName + ".png"),
      width: width["@1,5x"],
      height: height["@1,5x"]
    }, {
      filePath: path.resolve(resPath, "mipmap-xhdpi", logoFileName + ".png"),
      width: width["@2x"],
      height: height["@2x"]
    }, {
      filePath: path.resolve(resPath, "mipmap-xxhdpi", logoFileName + ".png"),
      width: width["@3x"],
      height: height["@3x"]
    }, {
      filePath: path.resolve(resPath, "mipmap-xxxhdpi", logoFileName + ".png"),
      width: width["@4x"],
      height: height["@4x"]
    });
  }

  if (ios) {
    const projectPath = ios.projectPath.replace(/.xcodeproj$/, "");
    const imagesPath = path.resolve(projectPath, "Images.xcassets");

    if (fs.existsSync(projectPath)) {
      const storyboardPath = path.resolve(projectPath, "BootSplash.storyboard");
      fs.writeFileSync(storyboardPath, getStoryboard({
        height: height["@1x"],
        width: width["@1x"],
        backgroundColor: backgroundColorHex
      }), "utf-8");
      log("\u2728  ".concat(path.relative(workingDirectory, storyboardPath)), true);
    } else {
      log("No \"".concat(projectPath, "\" directory found. Skipping iOS storyboard generation\u2026"));
    }

    if (fs.existsSync(imagesPath)) {
      const imageSetPath = path.resolve(imagesPath, xcassetName + ".imageset");
      fs.ensureDirSync(imageSetPath);
      fs.writeFileSync(path.resolve(imageSetPath, "Contents.json"), ContentsJson, "utf-8");
      images.push({
        filePath: path.resolve(imageSetPath, logoFileName + ".png"),
        width: width["@1x"],
        height: height["@1x"]
      }, {
        filePath: path.resolve(imageSetPath, logoFileName + "@2x.png"),
        width: width["@2x"],
        height: height["@2x"]
      }, {
        filePath: path.resolve(imageSetPath, logoFileName + "@3x.png"),
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
    log("\u2728  ".concat(path.relative(workingDirectory, filePath), " (").concat(width, "x").concat(height, ")"), true);
  })));
  log("\u2705  Done! Thanks for using ".concat(chalk.underline("react-native-bootsplash"), "."));
};
//# sourceMappingURL=generate.js.map