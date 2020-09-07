import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
	Dimensions,
	Image,
	LayoutAnimation,
	ScrollView,
	StyleSheet,
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
	ActivityIndicator,
	Appbar,
	Banner,
	Button,
	Card,
	Searchbar,
	Text,
} from "react-native-paper";
import { InfoCards } from "../Components/base_cards";
import { BaseRows } from "../Components/base_rows";
import { TaiyakiScrollView, TaiyakiView } from "../Components/taiyaki_view";
import { AnilistBasicModel } from "../Models/Anilist/basic_models";
import { useAnilistSWR } from "../Util/hooks";

const DiscoveryScreen = () => {
	const navigation = useNavigation();
	//TODO: DYNAMIC VALUES
	const season = "FALL";
	const seasonYear = 2020;

	const [query, setQuery] = useState<string>("");
	const [bannerVisible, setBannerVisibility] = useState<boolean>(true);

	const {
		swr: { data: trendingAnime },
	} = useAnilistSWR<{ data: { Page: { media: AnilistBasicModel[] } } }>(
		"query{Page(perPage:30){media(type:ANIME,sort:TRENDING_DESC, isAdult:false){mediaListEntry{progress status}bannerImage id idMal title{english romaji}description coverImage{extraLarge}}}}",
		"trend"
	);

	const {
		swr: { data: seasonalAnime },
	} = useAnilistSWR<{ data: { Page: { media: AnilistBasicModel[] } } }>(
		"query{Page(perPage:30){media(type:ANIME,season:" +
			season +
			",seasonYear:" +
			seasonYear +
			",isAdult:false){mediaListEntry{progress status} id idMal title{english romaji}bannerImage coverImage{extraLarge}}}}",
		"season"
	);

	const {
		swr: { data: popular },
	} = useAnilistSWR<{ data: { Page: { media: AnilistBasicModel[] } } }>(
		"query{Page(perPage:30){media(type:ANIME,sort:FAVOURITES_DESC, isAdult:false){mediaListEntry{progress status}id idMal title{english romaji}description bannerImage coverImage{extraLarge}}}}",
		"popular"
	);

	const {
		swr: { data: searchResults },
	} = useAnilistSWR<{
		data: { Page: { media: AnilistBasicModel[] } };
	}>(
		`query{Page(perPage:30){media(search:"${query}", type:ANIME, isAdult:false){title{romaji}id idMal coverImage{extraLarge}}}}`,
		query,
		query.length > 3
	);

	const _renderSearchResults = ({ item }: { item: AnilistBasicModel }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					navigation.navigate("Detailed", {
						id: item.id,
						image: item.coverImage.extraLarge,
						title: item.title.romaji,
						malID: item.idMal,
					});
				}}>
				<TaiyakiView style={{ margin: 8, flexDirection: "row" }}>
					<Image
						source={{ uri: item.coverImage.extraLarge }}
						style={{
							height: Dimensions.get("window").height * 0.12,
							width: Dimensions.get("window").width * 0.18,
							borderRadius: 6,
						}}
					/>
					<Text
						style={{
							margin: 8,
							fontSize: 14,
							fontWeight: "600",
							flexShrink: 0.8,
						}}>
						{item.title.romaji}
					</Text>
				</TaiyakiView>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title="Discovery" />
			</Appbar.Header>
			<TaiyakiScrollView>
				<Searchbar
					style={styles.searchBar}
					value={query}
					placeholder={"Search for an anime"}
					onChangeText={(q) => {
						setQuery(q);
						LayoutAnimation.configureNext(
							LayoutAnimation.Presets.easeInEaseOut
						);
					}}
					autoCorrect={false}
				/>

				{query.length > 0 && !searchResults && (
					<Card
						style={{
							height: Dimensions.get("window").height * 0.2,
							marginHorizontal: 8,
							marginBottom: 10,
							alignContent: "center",
							justifyContent: "center",
						}}>
						<ActivityIndicator style={{ marginTop: 25 }} />
						{query.length <= 3 && (
							<Text
								style={{
									fontSize: 15,
									fontWeight: "400",
									textAlign: "center",
									margin: 8,
								}}>
								Minimum of 3 letters is required
							</Text>
						)}
					</Card>
				)}

				{searchResults && (
					<Card
						style={{
							marginHorizontal: 8,
							maxHeight: Dimensions.get("window").height * 0.4,
							marginBottom: 10,
						}}>
						<FlatList
							data={searchResults?.data?.Page?.media ?? []}
							renderItem={_renderSearchResults}
							keyExtractor={(item) => item.id.toString()}
						/>
					</Card>
				)}

				<Banner
					visible={bannerVisible}
					actions={[
						{ label: "No Thanks", onPress: () => setBannerVisibility(false) },
						{ label: "Configure", onPress: () => {} },
					]}>
					Taiyaki automatically refreshes data every hour, would you like to
					change this?
				</Banner>

				<BaseRows
					rowTitle={"Trending Anime"}
					data={trendingAnime?.data.Page.media.map((i) => ({
						title: i.title.romaji ?? i.title.english,
						image: i.coverImage.extraLarge,
						id: i.id,
						malID: i.idMal,
					}))}
				/>

				<BaseRows
					rowTitle={season + " " + seasonYear.toString()}
					data={seasonalAnime?.data.Page.media.map((i) => ({
						title: i.title.romaji ?? i.title.english,
						image: i.coverImage.extraLarge,
						id: i.id,
						malID: i.idMal,
					}))}
				/>

				<Card style={{ marginVertical: 8 }}>
					<Card.Title
						title={"Sign in to a tracker"}
						subtitle={"Taiyaki supports multiple popular trackers"}
					/>
					<Card.Actions style={{ justifyContent: "flex-end" }}>
						<Button
							mode={"contained"}
							onPress={() => {
								navigation.navigate("Trackers");
							}}>
							View Options
						</Button>
					</Card.Actions>
				</Card>
				<BaseRows
					rowTitle={"All Time Popular"}
					data={popular?.data.Page.media.map((i) => ({
						title: i.title.romaji ?? i.title.english,
						image: i.coverImage.extraLarge,
						id: i.id,
						malID: i.idMal,
					}))}
				/>
			</TaiyakiScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		margin: 8,
	},
});

export default DiscoveryScreen;
