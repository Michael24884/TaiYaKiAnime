import { useNavigation } from "@react-navigation/native";
import React, { FC, memo, useEffect, useMemo, useRef, useState } from "react";
import CoverArt from "../Components/cover_art";
import { AnilistDetailedModel } from "../Models/Anilist/basic_models";
import { useAnilistSWR } from "../Util/hooks";
import { TabView, TabBar } from "react-native-tab-view";
import { Dimensions } from "react-native";
import EpisodesScreen from "./Details/episodes";
import DetailedMainScreen from "./Details/detailed";
import { Appbar, Snackbar, useTheme } from "react-native-paper";
import CharacterScreen from "./Details/characters";
import RelationScreen from "./Details/relations";
import { useAsyncStorage } from "@react-native-community/async-storage";
import { DetailedDatabaseModel } from "../Models/Taiyaki/models";

interface Props {
	route: {
		params: {
			id: number;
			image: string;
			title: string;
			malID: number | string;
		};
	};
}

const DetailedScreen: FC<Props> = (props) => {
	const { id, image, title } = props.route.params;

	const navigation = useNavigation();
	const theme = useTheme();
	const [showCover, setShowCover] = useState<boolean>(true);
	const [database, setDatabase] = useState<DetailedDatabaseModel>();

	const {
		swr: { data: anilistData },
	} = useRef(
		useAnilistSWR<{ data: { Media: AnilistDetailedModel } }>(
			"query{Media(id:" +
				id +
				"){source description genres id idMal tags{name rank description} coverImage{extraLarge} trending status nextAiringEpisode{episode timeUntilAiring}title{english, romaji}recommendations{nodes{mediaRecommendation{id idMal title{romaji}coverImage{extraLarge}}}}relations{edges{relationType node{type title{romaji}coverImage{extraLarge}id}}}bannerImage characters{edges{role node{name{full}image{large}}}}meanScore averageScore favourites stats{scoreDistribution{score amount}statusDistribution{status amount}}rankings{season year rank context}mediaListEntry{progress status}episodes season seasonYear format duration source countryOfOrigin startDate{year month day}endDate{year month day}}}",
			id.toString()
		)
	).current;

	const { getItem, mergeItem } = useAsyncStorage(`${id}`);

	useEffect(() => {
		if (anilistData) {
			_closeCover();
		}
	}, [anilistData]);

	useEffect(() => {
		_searchDatabase();
	}, []);

	const _searchDatabase = async () => {
		const _item = await getItem();
		if (_item) {
			const database = JSON.parse(_item) as DetailedDatabaseModel;
			// console.log(database);
			setDatabase(database);
		}
	};

	const _closeCover = () => {
		setTimeout(() => {
			setShowCover(false);
		}, 1510);
	};

	const initialLayout = {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
	};
	const [index, setIndex] = useState<number>(0);
	const [snack, setSnack] = useState<boolean>(false);

	const [routes] = useState<{ key: string; title: string }[]>([
		{ key: "detail", title: "Detail" },
		{ key: "episodes", title: "Episodes" },
		{ key: "characters", title: "Characters" },
		{ key: "relations", title: "Relations" },
	]);

	const renderTabBar = (props: any) => (
		<TabBar
			{...props}
			indicatorStyle={{ backgroundColor: theme.colors.accent }}
			style={{ backgroundColor: theme.colors.primary }}
			scrollEnabled={true}
		/>
	);

	const renderScene = ({ route }: { route: any }) => {
		switch (route.key) {
			case "detail":
				return (
					<DetailedMainScreen
						id={id}
						data={anilistData?.data.Media}
						database={database}
					/>
				);
			case "episodes":
				return (
					<EpisodesScreen
						aniID={id}
						title={title}
						database={database}
						malID={Number(anilistData?.data.Media.idMal)}
						status={anilistData?.data.Media.status}
					/>
				);
			case "characters":
				return <CharacterScreen id={id} />;
			case "relations":
				return <RelationScreen id={id} />;
		}
	};

	return (
		<>
			{anilistData && (
				<>
					<Appbar.Header>
						<Appbar.BackAction onPress={() => navigation.goBack()} />
						<Appbar.Content
							title={
								anilistData?.data?.Media?.title?.romaji ??
								anilistData?.data.Media.title.english
							}
						/>
					</Appbar.Header>
					<TabView
						lazyPreloadDistance={1}
						lazy={true}
						navigationState={{ index, routes }}
						renderScene={renderScene}
						onIndexChange={setIndex}
						initialLayout={initialLayout}
						renderTabBar={renderTabBar}
					/>
					<Snackbar
						visible={snack}
						action={{
							label: "Dismiss",
							onPress: () => setSnack(false),
						}}
						onDismiss={() => setSnack(false)}>
						Now following this anime
					</Snackbar>
				</>
			)}
			{showCover && (
				<CoverArt
					title={title}
					image={image}
					shouldClose={anilistData !== undefined}
				/>
			)}
		</>
	);
};

const _arePropsEqual = (op: Props, np: Props): boolean => {
	return op.route === np.route;
};
export default memo(DetailedScreen, _arePropsEqual);
