import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import {
	Dimensions,
	StyleSheet,
	View,
	Image,
	LayoutAnimation,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator, Surface, Text } from "react-native-paper";
import { BaseCard } from "./base_cards";

interface Props {
	rowTitle: string;
	data:
		| {
				title: string;
				image: string;
				id: number;
				malID: string;
		  }[]
		| undefined;
}

export const BaseRows: FC<Props> = (props) => {
	const { rowTitle, data } = props;
	const { push } = useNavigation<any>();

	const _renderItem = ({
		item,
	}: {
		item: { title: string; image: string; id: number; malID: string };
	}) => {
		return (
			<BaseCard
				title={item.title}
				image={item.image}
				onPress={
					() =>
						push("Detailed", {
							id: item.id,
							image: item.image,
							title: item.title,
							malID: item.malID,
						})
					// push("Episodes", {
					// 	malID: item.malID,
					// })
				}
			/>
		);
	};

	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	return (
		<Surface style={{ marginVertical: 8 }}>
			<Text style={styles.rowTitle}>{rowTitle}</Text>
			{data ? (
				<FlatList
					horizontal
					data={data}
					renderItem={_renderItem}
					keyExtractor={(item) => String(item.id)}
				/>
			) : (
				<View>
					<ActivityIndicator style={{ marginVertical: 8 }} />
				</View>
			)}
		</Surface>
	);
};

const styles = StyleSheet.create({
	view: {
		margin: 8,
	},
	rowTitle: {
		fontWeight: "700",
		fontSize: 21,
		margin: 8,
	},
	image: {
		height: Dimensions.get("window").height * 0.2,
		width: Dimensions.get("window").height * 0.15,
		borderRadius: 6,
	},
});
