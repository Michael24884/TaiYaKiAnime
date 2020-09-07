import React from "react";

interface IconProps {
  type:
    | string
    | "AntDesign"
    | "MaterialIcons"
    | "EvilIcons"
    | "Entypo"
    | "FontAwesome"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "Zocial"
    | "Octicons"
    | "SimpleLineIcons"
    | "Fontisto"
    | "Feather";
  name: string;
  size?: number;
  color?: string;
  onPress?: Function;
  style?: React.CSSProperties;
}

const Icon = (props: IconProps): JSX.Element => {
  const { type, name, color, size, onPress, style } = props;
  switch (type) {
    case "AntDesign": {
      const AntDesign = require("react-native-vector-icons/AntDesign").default;
      return (
        <AntDesign
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "Entypo": {
      const Entypo = require("react-native-vector-icons/Entypo").default;
      return (
        <Entypo
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "Ionicons": {
      const Ionicons = require("react-native-vector-icons/Ionicons").default;
      return (
        <Ionicons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "SimpleLineIcons": {
      const SimpleLineIcons = require("react-native-vector-icons/SimpleLineIcons")
        .default;
      return (
        <SimpleLineIcons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "EvilIcons": {
      const EvilIcons = require("react-native-vector-icons/EvilIcons").default;
      return (
        <EvilIcons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "MaterialIcons": {
      const MaterialIcons = require("react-native-vector-icons/MaterialIcons")
        .default;
      return (
        <MaterialIcons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "FontAwesome": {
      const FontAwesome = require("react-native-vector-icons/FontAwesome")
        .default;
      return (
        <FontAwesome
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "Foundation": {
      const Foundation = require("react-native-vector-icons/Foundation")
        .default;
      return (
        <Foundation
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "MaterialCommunityIcons": {
      const MaterialCommunityIcons = require("react-native-vector-icons/MaterialCommunityIcons")
        .default;
      return (
        <MaterialCommunityIcons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "Zocial": {
      const Zocial = require("react-native-vector-icons/Zocial").default;
      return (
        <Zocial
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    case "Octicons": {
      const Octicons = require("react-native-vector-icons/Octicons").default;
      return (
        <Octicons
          name={name}
          style={style}
          color={color}
          size={size ? size : 18}
          onPress={onPress}
        />
      );
    }
    case "Fontisto": {
      const Fontisto = require("react-native-vector-icons/Fontisto").default;
      return (
        <Fontisto
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }
    case "Feather": {
      const Feather = require("react-native-vector-icons/Feather").default;
      return (
        <Feather
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }

    default: {
      const MaterialIcons = require("react-native-vector-icons/MaterialIcons")
        .default;
      return (
        <MaterialIcons
          name={name}
          size={size}
          style={style}
          color={color}
          onPress={onPress}
        />
      );
    }
  }
};

Icon.defaultProps = {
  size: 20,
  style: {},
  onPress: null,
  color: "#757575",
};

export default Icon;
