import React, { useState } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import { Appbar, Surface } from "react-native-paper";
import { TaiyakiImage } from "../Components/taiyaki_view";
import { HistoryModel } from "../Models/Taiyaki/models";

const HistoryScreen = () => {
	const [history, setHistory] = useState<HistoryModel[]>([]);

	const _renderItem = ({ item }: { item: HistoryModel }) => {
		return (
			<Surface style={styles.view}>
				<TaiyakiImage url={item.image} style={styles.image} />
			</Surface>
		);
	};

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={"History"} />
			</Appbar.Header>
			<Surface>
				<FlatList
					data={history}
					renderItem={_renderItem}
					keyExtractor={(item) => item.id.toString()}
				/>
			</Surface>
		</>
	);
};

const styles = StyleSheet.create({
	view: {
		borderRadius: 6,
		marginHorizontal: 8,
		marginVertical: 4,
		padding: 8,
		flexDirection: "row",
	},
	image: {
		width: Dimensions.get("window").width * 0.2,
		height: Dimensions.get("window").height * 0.15,
		borderRadius: 6,
	},
});

export default HistoryScreen;
