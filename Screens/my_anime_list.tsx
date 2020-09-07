import { useFocusEffect } from "@react-navigation/native";
import React, { memo, useRef, useState } from "react";
import {
	ActivityIndicator,
	Appbar,
	useTheme,
	Surface,
} from "react-native-paper";
import { EmptyScreen } from "../Components/empty_screen";
import { MyListModel, Trackers } from "../Models/Taiyaki/models";
import { useAnilistSWR } from "../Util/hooks";
import { store } from "../Util/store";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import { Dimensions } from "react-native";
import MyList from "../Components/list";
import {
	AnilistEntriesList,
	AnilistUserList,
	AnilistUserListBase,
} from "../Models/Anilist/basic_models";
import { stringToWatchStatus } from "../Util/conversions";

const MyAnimeList = () => {
	const theme = useTheme();
	const [index, setIndex] = useState<number>(0);
	const [routes] = useState<{ key: string; title: string }[]>([
		{ key: "first", title: "Watching" },
		{ key: "second", title: "Planning" },
		{ key: "third", title: "Completed" },
		{ key: "fourth", title: "Paused" },
		{ key: "fifth", title: "Dropped" },
	]);

	//const [canShowList, enableList] = useSusetate<boolean>(false);
	let canShowList = useRef(false);

	//const [currentTracker, setTracker] = useState<Trackers>("Anilist");

	useFocusEffect(() => {
		const { anilist, myanimelist } = store.get();
		if (anilist || myanimelist) {
			//enableList(true);
			canShowList.current = true;
		}
	});

	if (!canShowList)
		return (
			<EmptyScreen message={"Please sign in to a tracker to view your lists"} />
		);

	const {
		swr: { data: anilistList },
	} = useAnilistSWR<AnilistUserListBase>(
		`query{MediaListCollection(userId:${
			store.get().anilist.userID
		},type:ANIME, sort:UPDATED_TIME_DESC){lists{entries{progress status score media{episodes id idMal title{romaji}coverImage{extraLarge color}}}}}}`
	);

	if (!anilistList)
		return (
			<Surface
				style={{
					height: "100%",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<ActivityIndicator />
			</Surface>
		);

	const flatten = () => {
		let _list: MyListModel[] = [];
		const _data = anilistList.data.MediaListCollection.lists as Array<
			AnilistUserList
		>;
		for (var i = 0; i < _data.length; i++) {
			const entries = _data[i].entries as Array<AnilistEntriesList>;
			for (var e = 0; e < entries.length; e++) {
				const data = entries[e];
				_list.push({
					title: data.media.title.romaji,
					image: data.media.coverImage.extraLarge,
					id: data.media.id,
					status: stringToWatchStatus.get(data.status)!,
					tracker: "Anilist",
					progress: data.progress,
					score: data.score,
					totalEpisodes: data.media.episodes,
				});
			}
		}
		return _list;
	};

	const Watching = () => (
		<MyList data={flatten().filter((i) => i.status === "Watching")} key={"1"} />
	);
	const Planning = () => (
		<MyList data={flatten().filter((i) => i.status === "Planning")} key={"2"} />
	);
	const Completed = () => (
		<MyList
			data={flatten().filter((i) => i.status === "Completed")}
			key={"3"}
		/>
	);
	const Paused = () => (
		<MyList data={flatten().filter((i) => i.status === "Paused")} key={"4"} />
	);
	const Dropped = () => (
		<MyList data={flatten().filter((i) => i.status === "Dropped")} key={"5"} />
	);

	const renderScene = SceneMap({
		first: Watching,
		second: Planning,
		third: Completed,
		fourth: Paused,
		fifth: Dropped,
	});

	const renderTabBar = (props: any) => (
		<TabBar
			{...props}
			indicatorStyle={{ backgroundColor: theme.colors.accent }}
			style={{ backgroundColor: theme.colors.primary }}
			scrollEnabled={true}
		/>
	);

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={"My List"} />
			</Appbar.Header>
			<TabView
				lazy={true}
				lazyPreloadDistance={1}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				onIndexChange={setIndex}
				renderTabBar={renderTabBar}
			/>
		</>
	);
};

export default memo(MyAnimeList, () => true);
