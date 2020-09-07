import { useNavigation } from "@react-navigation/native";
import React, { FC, memo, useMemo } from "react";
import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ProgressBar, Surface, Text } from "react-native-paper";
import { MyListModel } from "../Models/Taiyaki/models";

interface Props {
	data: MyListModel[];
}
const MyList: FC<Props> = (props) => {
	const { data } = props;
	const navigation = useNavigation();

	const _progress = (
		watched: number | undefined,
		total: number | undefined
	): number => {
		let numerator: number = 0;
		let denominator: number = 0;
		if (watched) numerator = watched;
		if (total) denominator = total;
		return numerator / denominator;
	};

	const _renderItem = ({ item }: { item: MyListModel }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					navigation.navigate("Detailed", {
						id: item.id,
						title: item.title,
						image: item.image,
					});
				}}>
				<Surface style={styles.view}>
					<Image source={{ uri: item.image }} style={styles.image} />
					<View
						style={{
							flexShrink: 0.8,
							justifyContent: "space-between",
							width: "100%",
							paddingHorizontal: 8,
						}}>
						<Text numberOfLines={2} style={styles.title}>
							{item.title}
						</Text>
						<View>
							<View
								style={{
									flexDirection: "row",
									width: "100%",
									justifyContent: "space-between",
								}}>
								<Text>{`${item.progress ?? "??"} / ${
									item.totalEpisodes ?? "??"
								}`}</Text>
								<Text>{`${item.score ?? "-"}`}</Text>
							</View>
							<ProgressBar
								progress={_progress(item.progress, item.totalEpisodes)}
							/>
						</View>
					</View>
				</Surface>
			</TouchableOpacity>
		);
	};

	return (
		<Surface style={{ height: "100%" }}>
			{useMemo(
				() => (
					<FlatList
						key={data[0].id.toString()}
						data={data}
						renderItem={_renderItem}
						keyExtractor={(item) => item.id.toString()}
					/>
				),
				[]
			)}
		</Surface>
	);
};
const styles = StyleSheet.create({
	view: {
		borderRadius: 6,
		flexDirection: "row",
		padding: 8,
		marginHorizontal: 8,
		marginVertical: 4,
	},
	image: {
		height: Dimensions.get("window").height * 0.12,
		width: Dimensions.get("window").width * 0.22,
		borderRadius: 4,
	},
	title: {
		fontSize: 16,
		fontWeight: "500",
	},
});

const _equalizer = (op: Props, np: Props): boolean => {
	return op.data === np.data;
};
export default memo(MyList, _equalizer);
