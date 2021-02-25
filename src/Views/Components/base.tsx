/* eslint-disable react-native/no-inline-styles */
import React, { FC, useState } from "react";
import {
	Dimensions,
	Platform,
	StyleProp,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
	TextProps,
} from "react-native";
import ParsedText from "react-native-parsed-text";
import { heightPercentageToDP } from "react-native-responsive-screen";
//import { useTheme } from "../../Stores/theme";
import { breakLine, italics, paragraph } from "../../Util";
import { useThemeComponentState } from "./storeConnect";

interface TextPropsLocal {
	style?: StyleProp<TextStyle>;
	numberOfLines?: number;
	shouldShrink?: boolean;
	textProps?: TextProps;
}
const { height, width } = Dimensions.get("window");

export const ThemedText: FC<TextPropsLocal> = (props) => {
	const { style, textProps, numberOfLines, children, shouldShrink } = props;
	const color = useThemeComponentState().text;
	return (
		<Text
			{...textProps}
			adjustsFontSizeToFit={shouldShrink}
			minimumFontScale={0.62}
			numberOfLines={numberOfLines}
			style={[{ color }, style, { fontFamily: "Poppins" }]}
		>
			{children}
		</Text>
	);
};

export const Divider: FC<{ color?: string }> = (props) => {
	return (
		<View style={{ backgroundColor: props.color ?? "grey", height: 0.4 }} />
	);
};

export const ThemedButton: FC<{
	style?: StyleProp<ViewStyle>;
	title?: string;
	color?: string;
	onPress: () => void;
	disabled?: boolean;
}> = (props) => {
	// const {
	// 	colors: { primary, accent },
	// 	dark,
	// } = useTheme((_) => _.theme);
	const {dark, colors: {primary, accent}} = useThemeComponentState().theme;
	return (
		<TouchableOpacity onPress={() => (props.disabled ? null : props.onPress())}>
			<View
				style={[
					{
						backgroundColor: props.color
							? props.color
							: dark
							? accent
							: primary,
						borderRadius: 4,
						alignItems: "center",
						justifyContent: "center",
						height: height * 0.06,
						width: width * 0.9,
						alignSelf: "center",
						marginVertical: height * 0.01,
					},
					props.style,
					props.onPress !== undefined
						? {
								shadowColor: "black",
								shadowOpacity: 0.22,
								shadowOffset: { width: 0, height: 1 },
								shadowRadius: 5,
								...Platform.select({ android: { elevation: 4 } }),
						  }
						: null,
				]}
			>
				{props.title ? (
					<Text style={[{ color: "white", fontWeight: "bold", fontSize: heightPercentageToDP(1.9) }]}>
						{props.title.toUpperCase()}
					</Text>
				) : (
					props.children
				)}
			</View>
		</TouchableOpacity>
	);
};

interface ViewProps {
	style?: StyleProp<ViewStyle>;
}

export const ThemedSurface: FC<ViewProps> = (props) => {
	const { style, children } = props;
	const backgroundColor = useThemeComponentState().background;
	return <View style={[{ backgroundColor }, style]}>{children}</View>;
};

export const ThemedCard: FC<ViewProps> = (props) => {
	const { style, children } = props;
	const backgroundColor = useThemeComponentState().background;
	return (
		<View
			style={[
				{
					backgroundColor: "transparent",
					marginBottom: height * 0.025,
					marginHorizontal: width * 0.01,
					...Platform.select({
						android: { elevation: 4 },
						ios: {
							shadowColor: "black",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.2,
							shadowRadius: 6,
						},
					}),
				},
			]}
		>
			<View
				style={[
					{ overflow: "hidden", borderRadius: 4, backgroundColor },
					style,
				]}
			>
				{children}
			</View>
		</View>
	);
};

interface ParsedProps {
	color: string;
	numberOfLines?: number;
	style: StyleProp<TextStyle>;
}

export const TaiyakiParsedText: FC<ParsedProps> = (props) => {
	const { style, color, numberOfLines } = props;

	const [spoilerShown, setSpoiler] = useState<boolean>(false);

	return (
		<ParsedText
			numberOfLines={numberOfLines ?? 0}
			style={[style, { color, fontFamily: "Poppins", fontSize: heightPercentageToDP(1.6) }]}
			parse={[
				{ pattern: /<br>/g, renderText: breakLine },
				{ pattern: /<br >/g, renderText: breakLine },
				{ pattern: /<br \/>/g, renderText: breakLine },
				{
					pattern: /<i>(.*)<\/i>/s,
					renderText: italics,
					style: { fontStyle: "italic" },
				},
				{
					pattern: /<p>(.*)<\/p>/ms,
					renderText: paragraph,
				},
				{
					pattern: /<a.+>(.*)<\/a>/ms,
					renderText: () => "",
				},
				{ pattern: /&mdash;/g, renderText: (_: string) => `--` },
				{
					pattern: /\*\*(.*)\*\*/,
					renderText: (_: string, match: string[]) => match[1],
					style: { fontWeight: "bold" },
				},
				{
					pattern: /;n(.*);n/g,
					renderText: (_: string, match: string[]) => `  ${match[1]}`,
					style: {
						color: "orange",
						fontSize: 21,
						fontWeight: "800",
						margin: 8,
					},
				},
				{
					pattern: /;o(.*);o/g,
					renderText: (_: string, match: string[]) => `  ${match[1]}`,
					style: {
						color: "#457b9d",
						fontSize: 21,
						fontWeight: "800",
						margin: 8,
					},
				},
				{
					pattern: /;b(.*);b/g,
					renderText: (_: string, match: string[]) => `  ${match[1]}`,
					style: {
						color: "#e71d36",
						fontSize: 21,
						fontWeight: "800",
						margin: 8,
					},
				},
				{
					pattern: /;a(.*);a/g,
					renderText: (_: string, match: string[]) =>
						`${match[1]} (android only)`,
					style: { color: "green", fontSize: 16, fontWeight: "300" },
				},
				{
					pattern: /__(.*)__/g,
					renderText: (_: string, match: string[]) => `${match[1]}`,
					style: { fontWeight: "bold" },
				},
				{
					pattern: /~!(.*)!~/s,
					renderText: (_: string, match: string[]) =>
						!spoilerShown ? "Show Spoiler" : match[1],
					style: !spoilerShown ? { color: "orange", fontSize: 21 } : style,
					onPress: () => setSpoiler((o) => !o),
				},
			]}
		>
			{props.children}
		</ParsedText>
	);
};
