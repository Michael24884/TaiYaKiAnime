import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useMemo, useState } from "react";
import {
	Dimensions,
	Image,
	LayoutAnimation,
	SectionList,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Appbar, Surface, Text, useTheme } from "react-native-paper";
import { EmptyScreen } from "../Components/empty_screen";
import { TaiyakiImage, TaiyakiView } from "../Components/taiyaki_view";
import { SimklEpisodes } from "../Models/SIMKL/models";
import { MyQueueModel } from "../Models/Taiyaki/models";
import { simklThumbnailCreator } from "../Util/conversions";
import { dynamicQueueStore, queueStore } from "../Util/store";

type SectionData = {
	title: string;
	data: MyQueueModel[];
};

const MyQueueScreen = () => {
	const styles = StyleSheet.create({
		container: {
			flex: 1,
		},
		header: {
			color: "gray",
			fontSize: 14,
		},
		upNextView: {
			marginHorizontal: 10,
		},
		upNextImage: {
			borderRadius: 6,
			marginBottom: 5,
		},
		upNextEpisode: {
			color: useTheme().colors.primary,
			fontSize: 13,
		},
		upNextTitle: {
			fontWeight: "600",
			fontSize: 18,
		},
		upNextDesc: {
			fontWeight: "400",
			color: "gray",
			fontSize: 15,
		},
		emptyMessage: {
			fontSize: 21,
			textAlign: "center",
			fontWeight: "bold",
		},
		queueItemImage: {
			width: Dimensions.get("window").width * 0.35,
			height: Dimensions.get("window").height * 0.11,
			borderRadius: 6,
			marginRight: 5,
		},
		queueItemTitle: {
			fontSize: 18,
			fontWeight: "500",
		},
		queueItemNumber: {
			color: useTheme().colors.primary,
			fontSize: 15,
		},
		rowBack: {
			alignItems: "center",
			backgroundColor: "#DDD",
			flexDirection: "row",
			flex: 1,
			justifyContent: "space-between",
			paddingLeft: 15,
		},

		backRightBtn: {
			alignItems: "center",
			bottom: 0,
			justifyContent: "center",
			position: "absolute",
			top: 0,
			width: 75,
		},
		backRightBtnLeft: {
			backgroundColor: "blue",
			right: 75,
		},
		backRightBtnRight: {
			backgroundColor: "red",
			right: 0,
		},
	});

	const { push } = useNavigation<any>();

	const { dispatch, myQueue } = dynamicQueueStore("myQueue");

	const mimicConstructor = () => {
		if (Object.keys(myQueue).length !== 0) {
			return Object.entries(myQueue).map((_, index) => {
				const o = Object.keys(myQueue)[index];
				const d = Object.values(myQueue)[index];
				const m = {
					title: o,
					data: d,
				};
				return m;
			});
		}
		return [];
	};

	const [mimic, setMimic] = useState(mimicConstructor());

	useFocusEffect(
		useCallback(() => {
			setMimic(mimicConstructor());
		}, [myQueue])
	);
	//const [mimic, setMimic] = useState(mimicConstructor());

	//	useFocusEffect(() => setMimic(mimicConstructor()));
	// useFocusEffect(() => {
	// 	//setMimic(mimicConstructor());
	// 	console.log(myQueue.myQueue);
	// 	React.useCallback(() => {
	// 		setMimic(mimicConstructor());
	// 	}, [myQueue.myQueue]);
	// });

	const _renderSections = ({ item }: { item: MyQueueModel }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					dispatch("addToQueue", { key: item.title, data: item });
					//const s: SimklEpisodes = {title: item.title, episode: item.episodeNumber, embedLink: item.embedLink, img: item.thumbnail}
					//SimklEpisodes({ title:item.title, episodeLink: item.embedLink, episodeSynopsis: undefined, episodeThumbnail: _data.episodeThumbnail, episodeTitle: _data.episodeTitle, number: _data.episodeNumber })
					//   push('video_player_page', {
					//     episodeData: s,
					//     source: _data.source
					//   })
				}}>
				<Surface
					style={{
						flexDirection: "row",
						paddingHorizontal: 8,
						marginVertical: 6,
						flex: 1,
					}}>
					<View
						style={{
							marginVertical: 6,
							flexDirection: "row",
							flexShrink: 0.8,
						}}>
						{item.thumbnail !== null ? (
							<TaiyakiImage
								url={simklThumbnailCreator(item.thumbnail!)}
								style={styles.queueItemImage}
							/>
						) : (
							<Image
								source={require("../Assets/icon.png")}
								style={styles.queueItemImage}
							/>
						)}
						<View style={{ flexDirection: "column", flexShrink: 1 }}>
							<Text style={styles.queueItemNumber}>
								Episode {item.episodeNumber}
							</Text>
							<Text style={styles.queueItemTitle}>
								{item.episodeTitle ?? "???"}
							</Text>
						</View>
					</View>
				</Surface>
			</TouchableOpacity>
		);
	};

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={"My Queue"} />
			</Appbar.Header>

			{mimic.length === 0 ? (
				<EmptyScreen message={"Your queue list is empty"} />
			) : (
				<SectionList
					style={[{ height: "100%", width: "100%", flexGrow: 0 }]}
					sections={mimic}
					keyExtractor={(_, index) => String(index)}
					renderSectionHeader={({ section: { title } }) => (
						<TaiyakiView style={{ paddingHorizontal: 8, paddingTop: 10 }}>
							<Text style={styles.header}>{title}</Text>
							<View
								style={{
									width: "95%",
									height: 1,
									backgroundColor: "gray",
									marginVertical: 5,
								}}></View>
						</TaiyakiView>
					)}
					renderItem={_renderSections}
				/>
			)}
		</>
	);
};

export default MyQueueScreen;
