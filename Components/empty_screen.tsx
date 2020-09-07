import React, { FC } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import Icon from "react-native-dynamic-vector-icons";
interface Props {
	message: string;
}
export const EmptyScreen: FC<Props> = (props) => {
	const { message } = props;

	return (
		<Surface style={styles.container}>
			<Icon name="error" type={"MaterialIcons"} size={50} color={"red"} />
			<Text style={styles.text}>{message}</Text>
		</Surface>
	);
};

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},

	text: {
		fontSize: 20,
		fontWeight: "bold",
		margin: 8,
		textAlign: "center",
	},
});
