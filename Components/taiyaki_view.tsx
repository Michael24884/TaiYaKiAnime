import React, { FC, useState } from "react";
import {
	ImageStyle,
	ScrollView,
	StyleProp,
	TextStyle,
	View,
	ViewStyle,
} from "react-native";
import { useTheme } from "react-native-paper";
import { breakLine, italics } from "../Util/conversions";
import ParsedText from "react-native-parsed-text";
import FastImage from "react-native-fast-image";

interface Props {
	style?: StyleProp<ViewStyle>;
}

export const TaiyakiView: FC<Props> = (props) => {
	const { style } = props;
	return (
		<View
			style={[
				style ? style : null,
				{ backgroundColor: useTheme().colors.background },
			]}>
			{props.children}
		</View>
	);
};
export const TaiyakiScrollView = (props: any) => {
	return (
		<ScrollView
			{...props}
			style={{ backgroundColor: useTheme().colors.background }}>
			{props.children}
		</ScrollView>
	);
};

interface ParsedProps {
	color: string;
	style: StyleProp<TextStyle>;
}
export const TaiyakiParsedText: FC<ParsedProps> = (props) => {
	const { style, color } = props;

	const [spoilerShown, setSpoiler] = useState<boolean>(false);

	return (
		<ParsedText
			style={[style, { color }]}
			parse={[
				{ pattern: /<br>/g, renderText: breakLine },
				{
					pattern: /<i>(.*)<\/i>/s,
					renderText: italics,
					style: { fontStyle: "italic" },
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
			]}>
			{props.children}
		</ParsedText>
	);
};

interface ImageProps {
	url: string;
	style: StyleProp<ImageStyle>;
}

export const TaiyakiImage: FC<ImageProps> = (props) => {
	const { url, style } = props;

	//@ts-ignore
	return <FastImage source={{ uri: url }} style={style} />;
};
