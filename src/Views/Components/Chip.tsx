import React, { FC, memo } from "react";
import { StyleSheet, View } from "react-native";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import { useTheme } from "../../Stores";
import { ThemedText } from "./base";

interface Props {
	label: string;
}

const _Chip: FC<Props> = (props) => {
	const { label } = props;
	const theme = useTheme((_) => _.theme);

	return (
		<View style={[styles.view, { backgroundColor: theme.colors.accent }]}>
			<ThemedText style={styles.label}>{label}</ThemedText>
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		height: heightPercentageToDP(4),
		paddingHorizontal: heightPercentageToDP(2),
		marginRight: widthPercentageToDP(2),
		marginVertical: heightPercentageToDP(2),
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	label: {
		fontWeight: "600",
		color: 'white'
	},
});

export const Chip = memo(_Chip);
