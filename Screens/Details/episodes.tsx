import React, { ComponentType, useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { SimklEpisodes, SimklIDLookup } from "../../Models/SIMKL/models";
import { useSimklSWR } from "../../Util/hooks";
import { EpisodeCard } from "../../Components/base_cards";
import { TaiyakiView } from "../../Components/taiyaki_view";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { EmptyScreen } from "../../Components/empty_screen";
import { DetailedDatabaseModel } from "../../Models/Taiyaki/models";
import { SearchTitles } from "../../Components/search_titles";

interface Props {
	aniID: number;
	malID: number;
	title: string;
	status: string | undefined;
	route?: { params: { malID: number | string } };
	database: DetailedDatabaseModel | undefined;
}
const EpisodesScreen: ComponentType<Props> = (props) => {
	const { malID, route, status, database, title, aniID } = props;

	if (!status || status === "NOT_YET_RELEASED")
		return <EmptyScreen message={"This anime has not yet been released"} />;

	// if (!database || !database.savedLink)
	// 	return <SearchTitles query={title} callBack={() => {}} />;

	const {
		swr: { data: id },
		controller: idController,
	} = useSimklSWR<SimklIDLookup[]>(
		`/search/id?mal=${route?.params?.malID ?? malID}`
	);

	const {
		swr: { data: episodes },
		controller: episodesController,
	} = useSimklSWR<SimklEpisodes[]>(
		`/anime/episodes/${
			id && id.length > 0 ? id[0].ids.simkl : null
		}?extended=full`,
		"id"
	);

	useEffect(() => {
		return () => {
			idController.abort();
			episodesController.abort();
		};
	}, []);

	const _renderItem = ({ item }: { item: SimklEpisodes }) => {
		return <EpisodeCard item={item} anilistID={aniID} animeTitle={title} />;
	};

	return (
		<TaiyakiView style={{ height: "100%" }}>
			<FlatList
				data={episodes}
				ListHeaderComponent={() => (
					<View style={{ height: 25, paddingHorizontal: 9 }}>
						<Text
							style={{ fontSize: 13, fontWeight: "400", textAlign: "right" }}>
							Data provided by SIMKL
						</Text>
					</View>
				)}
				renderItem={_renderItem}
				keyExtractor={(_, index) => String(index)}
			/>
		</TaiyakiView>
	);
};

export default EpisodesScreen;
