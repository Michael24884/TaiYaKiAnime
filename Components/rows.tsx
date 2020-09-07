import React, { FC } from "react";
import { View, StyleSheet } from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";

interface Props {
	title: string;
	data?: string;
	color?: string;
}
export const InformationRows: FC<Props> = (props) => {
	const theme = useTheme();
	const styles = StyleSheet.create({
		title: {
			fontSize: 15,
			fontWeight: "600",
		},
		desc: {
			fontSize: 14,
			fontWeight: "400",
		},
	});
	const { title, data, color } = props;

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					width: "100%",
					justifyContent: "space-between",
					marginVertical: 5,
				}}>
				<Text style={styles.title}>{title}</Text>
				<Text style={[styles.desc, { color: color ?? theme.colors.text }]}>
					{data ?? "???"}
				</Text>
			</View>
			<Divider />
		</>
	);
};
