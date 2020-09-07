import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import {
	SectionList,
	TouchableOpacity,
	View,
	Image,
	FlatList,
	StyleSheet,
	Dimensions,
} from "react-native";
import { Surface, Text } from "react-native-paper";
import { EmptyScreen } from "../../Components/empty_screen";
import {
	AnilistRecEdge,
	AnilistRecommendations,
} from "../../Models/Anilist/basic_models";
import { useAnilistSWR } from "../../Util/hooks";

interface Props {
	id: number;
}

type Relations =
	| "PREQUEL"
	| "SEQUEL"
	| "PARENT"
	| "SIDE_STORY"
	| "CHARACTER"
	| "ALTERNATIVE"
	| "SPIN_OFF";

interface Section {
	title: Relations;
	data: AnilistRecEdge[];
}

const RelationScreen: FC<Props> = (props) => {
	const { id } = props;

	const { push } = useNavigation<any>();

	const nativeToRelations = new Map<string, Relations>([
		["PREQUEL", "PREQUEL"],
		["SEQUEL", "SEQUEL"],
		["PARENT", "PARENT"],
		["SIDE_STORY", "SIDE_STORY"],
		["CHARACTER", "CHARACTER"],
		["ALTERNATIVE", "ALTERNATIVE"],
		["SPIN_OFF", "SPIN_OFF"],
	]);

	const {
		swr: { data: relations },
	} = useAnilistSWR<AnilistRecommendations>(
		`query{Media(id: ${id}){relations{edges{relationType node{type title{romaji}coverImage{extraLarge}id}}}}}`,
		`${id}`
	);

	const _filterRelations = () => {
		if (!relations) return [];
		const { edges } = relations?.data.Media.relations;

		let items: Section[] = [];

		const _filter = edges
			.filter((i) => nativeToRelations.get(i.relationType) !== undefined)
			.filter((i) => i.node.type === "ANIME");
		if (_filter.length > 0) {
			for (let i = 0; i < _filter.length; i++) {
				const current = _filter[i];
				const semi = items.find((a) => a.title === current.relationType);
				if (semi) {
					semi.data.push(current);
				} else {
					items.push({
						title: nativeToRelations.get(current.relationType)!,
						data: [current],
					});
				}
			}

			return items;
		} else return [];
	};

	const _renderListItem = ({ item }: { item: AnilistRecEdge }) => {
		const { id } = item.node;
		const title = item.node.title.romaji;
		const image = item.node.coverImage.extraLarge;

		return (
			<TouchableOpacity
				onPress={() => {
					push("Detailed", {
						title,
						image,
						id,
					});
				}}>
				<View
					style={{
						marginVertical: 10,
						width: Dimensions.get("screen").width / 3,
					}}>
					<Image source={{ uri: image }} style={styles.image} />
					<Text style={styles.title}>{title}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const _renderItem = ({ section, index }: { section: any; index: number }) => {
		if (index !== 0) return null;
		return (
			<FlatList
				keyExtractor={(_, index) => String(index)}
				data={section.data}
				numColumns={3}
				renderItem={_renderListItem}
			/>
		);
	};

	return (
		<Surface style={{ height: "100%" }}>
			{relations && _filterRelations().length > 0 ? (
				<SectionList
					sections={_filterRelations()}
					keyExtractor={(item, index) => String(index)}
					renderItem={_renderItem}
					renderSectionHeader={({ section: { title, data } }) => {
						return (
							<Surface
								style={{
									paddingHorizontal: 10,
									paddingVertical: 8,
									opacity: 0.9,
									flexDirection: "row",
									justifyContent: "space-between",
								}}>
								<Text style={styles.type}>
									{(title as string).replace(/_/g, " ")}
								</Text>
								<Text style={styles.type}>{data.length}</Text>
							</Surface>
						);
					}}
				/>
			) : (
				<EmptyScreen message={"No relations found for this anime"} />
			)}
		</Surface>
	);
};

const styles = StyleSheet.create({
	type: {
		fontSize: 14,
		color: "grey",
		fontWeight: "400",
	},

	image: {
		marginRight: 8,
		marginLeft: 4,
		width: 110,
		height: 142,
		borderRadius: 8,
		overflow: "hidden",
	},
	title: {
		fontSize: 14,
		fontWeight: "500",
		marginHorizontal: 8,
		marginTop: 8,
	},
});

export default RelationScreen;
