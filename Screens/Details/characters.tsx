import React, { FC, useState, useEffect } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	Platform,
	SectionList,
	SectionListData,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import { EmptyScreen } from "../../Components/empty_screen";
import {
	AnilistBasicCharacters,
	AnilistCharacters,
} from "../../Models/Anilist/basic_models";
import { useAnilistSWR } from "../../Util/hooks";

interface Props {
	id: number;
}

const CharacterScreen: FC<Props> = (props) => {
	const { id } = props;
	const theme = useTheme();
	const [pageNumber, setPageNumber] = useState<number>(1);

	const {
		swr: { data: characters, mutate },
		controller,
	} = useAnilistSWR<AnilistCharacters>(
		`query{Media(id:${id}){characters(page: ${pageNumber}){pageInfo{hasNextPage currentPage}edges{role node{name{first last full native}image{large}description id}}}}}`,
		id.toString()
	);

	useEffect(() => {
		if (
			characters &&
			characters?.data?.Media?.characters?.pageInfo?.hasNextPage
		) {
			setPageNumber((page) => page + 1);
		}
		return () => controller.abort();
	}, [characters]);

	if (!characters)
		return (
			<Surface
				style={{
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}>
				<ActivityIndicator />
			</Surface>
		);

	type Roles = "MAIN" | "SUPPORTING" | "BACKGROUND";

	const _downloadData = async () => {
		// const _characters = await new AnilistAPI().ANILIST_CHARACTERS(animeID, page)
		// setCharacters((char) => char.concat(_characters.edges))
		// if (_characters.pageInfo.hasNextPage) {
		//     setPage((page) => page + 1);
		// }
	};

	type roles = {
		title: Roles;
		data: AnilistBasicCharacters[];
	};
	let mainRole: roles = {
		title: "MAIN",
		data: [],
	};
	let supportingRole: roles = {
		title: "SUPPORTING",
		data: [],
	};
	let backgroundRoles: roles = {
		title: "BACKGROUND",
		data: [],
	};

	const _filterRoles = () => {
		mainRole.data = characters.data.Media.characters.edges
			.filter((i) => {
				return i.role === "MAIN";
			})
			.map((i) => i.node);

		supportingRole.data = characters.data.Media.characters.edges
			.filter((i) => {
				return i.role === "SUPPORTING";
			})
			.map((i) => i.node);

		backgroundRoles.data = characters.data.Media.characters.edges
			.filter((i) => {
				return i.role === "BACKGROUND";
			})
			.map((i) => i.node);

		const _items = [mainRole, supportingRole, backgroundRoles];

		return _items.filter((i) => i.data.length > 0);
	};

	const _renderListItem = ({
		item,
		index,
	}: {
		item: AnilistBasicCharacters;
		index: number;
	}) => {
		const { image, name, id } = item;
		return (
			<TouchableOpacity onPress={() => {}}>
				<View
					style={{
						marginVertical: 15,
						marginHorizontal: 4,

						width: Dimensions.get("window").width / 3.25,
						height: Dimensions.get("window").height * 0.22,
					}}>
					<Image source={{ uri: image.large }} style={styles.image} />
					<Text style={styles.name}>{name.full}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	const _renderItem = ({ section, index }: { section: any; index: number }) => {
		if (index !== 0) return null;
		return (
			<FlatList
				data={section.data}
				numColumns={3}
				renderItem={_renderListItem}
				keyExtractor={(_, index) => String(index)}
				style={{ width: "100%" }}
			/>
		);
	};

	return (
		<Surface style={{ height: "100%" }}>
			{characters && characters.data.Media.characters.edges.length > 0 ? (
				<SectionList
					data={characters}
					sections={_filterRoles()}
					renderItem={_renderItem}
					style={{ width: "100%" }}
					keyExtractor={(_, index) => index.toString()}
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
								<Text
									style={[
										styles.roles,
										{ color: theme.colors.text ?? "grey" },
									]}>
									{title}
								</Text>
								<Text
									style={[
										styles.roles,
										{ color: theme.colors.text ?? "grey" },
									]}>
									{data.length}
								</Text>
							</Surface>
						);
					}}
				/>
			) : (
				<EmptyScreen message={"No characters found for this anime"} />
			)}
		</Surface>
	);
};

const styles = StyleSheet.create({
	image: {
		width: "100%",
		height: "85%",
		borderRadius: 6,
	},
	name: {
		marginVertical: 5,
		fontSize: 15,
	},
	roles: {
		fontSize: 17,

		fontWeight: "400",
	},
});

export default CharacterScreen;
