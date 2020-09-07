import React, { FC, useCallback, useEffect, useState } from "react";
import {
	View,
	Image,
	StyleSheet,
	Dimensions,
	LayoutAnimation,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
	Button,
	Card,
	Divider,
	ProgressBar,
	Surface,
	Text,
	useTheme,
} from "react-native-paper";
import Icon from "react-native-dynamic-vector-icons";
import { SimklEpisodes } from "../Models/SIMKL/models";
import { simklThumbnailCreator } from "../Util/conversions";
import { useAsyncStorage } from "@react-native-community/async-storage";
import { LastWatchingModel, MyQueueModel } from "../Models/Taiyaki/models";
import { dynamicQueueStore, queueStore } from "../Util/store";
import { useFocusEffect } from "@react-navigation/native";

interface Props {
	title: string;
	image: string;
	onPress: () => void;
}
export const BaseCard: FC<Props> = (props) => {
	const styles = StyleSheet.create({
		view: {
			margin: 8,
			height: Dimensions.get("window").height * 0.24,
			width: Dimensions.get("window").height * 0.15,
			marginBottom: 15,
		},
		rowTitle: {
			fontWeight: "700",
			fontSize: 21,
			margin: 8,
		},
		image: {
			height: "100%",
			width: "100%",
			borderRadius: 6,
		},
		title: {
			fontSize: 14,
			fontWeight: "400",
			marginTop: 8,
		},
		shadow: {
			height: "80%",
			shadowColor: "black",
			shadowOpacity: 0.25,
			shadowRadius: 4,
			shadowOffset: { width: 0, height: 0 },
		},
	});

	const { title, image, onPress } = props;

	return (
		<TouchableOpacity onPress={onPress}>
			<View shouldRasterizeIOS style={styles.view}>
				<View style={styles.shadow}>
					<Image source={{ uri: image }} style={styles.image} />
				</View>
				<Text numberOfLines={2} lineBreakMode={"tail"} style={styles.title}>
					{title}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

export const InfoCards = () => {
	const styles = StyleSheet.create({
		card: {
			borderRadius: 6,
			borderWidth: 1,
			borderColor: useTheme().colors.accent,
			width: Dimensions.get("window").width * 0.4,
			height: Dimensions.get("window").height * 0.25,
			backgroundColor: useTheme().colors.primary,
			marginVertical: 8,
			marginHorizontal: 4,
		},
	});

	return <View style={styles.card}></View>;
};

interface EpisodeProps {
	anilistID: number;
	animeTitle: string;
	item: SimklEpisodes;
}
export const EpisodeCard: FC<EpisodeProps> = (props) => {
	const { item, anilistID, animeTitle } = props;
	const [expanded, setExpanded] = useState<boolean>(false);

	const { dispatch, myQueue } = dynamicQueueStore("myQueue");

	const colors = useTheme();

	const _queueConverter = (): MyQueueModel => {
		return {
			embedLink: item.embedLink,
			episodeNumber: item.episode,
			id: anilistID,
			title: animeTitle,
			episodeTitle: item.title,
			thumbnail: item.img,
		};
	};

	// const _inList = () => {
	// 	return (
	// 		(myQueue.get()?.myQueue?.find((i) => i.id === anilistID) ?? false) &&
	// 		(myQueue
	// 			.get()
	// 			?.myQueue?.find((i) => i.id === anilistID ?? false)
	// 			?.data?.find((i) => i.episodeNumber === item.episode) ??
	// 			false)
	// 	);
	// };

	// useEffect(() => {
	// 	_inList();
	// }, [myQueue.get()]);

	useFocusEffect(
		useCallback(() => {
			setList(_inList());
		}, [myQueue])
	);

	const _inList = () => {
		return (
			Object.keys(myQueue).length > 0 &&
			myQueue[animeTitle] &&
			myQueue[animeTitle].find((i) => i.episodeNumber === item.episode)
		);
	};

	const [list, setList] = useState(_inList());

	return (
		<Card style={{ margin: 8 }}>
			<Card.Cover
				fadeDuration={1500}
				source={
					item.img !== null
						? { uri: simklThumbnailCreator(item.img) }
						: require("../Assets/icon.png")
				}
			/>
			<Card.Title
				title={"Episode " + item.episode.toString()}
				titleStyle={{
					fontSize: 14,
					fontWeight: "bold",
					color: colors.colors.primary,
				}}
				subtitle={item.title ?? "???"}
				subtitleNumberOfLines={expanded ? 0 : 2}
				subtitleStyle={{
					fontSize: 19,
					fontWeight: "600",
					marginBottom: 5,
					marginRight: 5,
				}}
			/>
			<Card.Content>
				<Text
					numberOfLines={expanded ? 0 : 3}
					style={{
						fontSize: 13,
						fontWeight: "400",
						marginBottom: 8,
					}}>
					{item.description ?? "No description for this anime yet."}
				</Text>
			</Card.Content>
			<Divider />
			<Card.Actions
				style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Icon
					name={expanded ? "arrow-drop-up" : "arrow-drop-down"}
					type={"MaterialIcons"}
					size={25}
					color={colors.colors.primary}
					onPress={() => {
						LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
						setExpanded((expanded) => !expanded);
					}}
				/>
				<View style={{ flexDirection: "row", justifyContent: "space-around" }}>
					<Button mode={"contained"}>Watch</Button>
					<Button
						onPress={() => {
							//myQueue.dispatch("modifyQueue", _queueConverter());
							dispatch("addToQueue", {
								key: animeTitle,
								data: _queueConverter(),
							});

							setList(_inList());
						}}
						style={{ marginLeft: 8 }}
						mode={"contained"}>
						{list ? "Remove from Queue" : "Add to Queue"}
					</Button>
				</View>
			</Card.Actions>
		</Card>
	);
};

interface TitleProps {
	id: number;
	coverImage: { extraLarge: string };
	title: { romaji?: string | undefined; english?: string };
	status: string;
	isFollowing: boolean;
}

export const TitleRow: FC<TitleProps> = (props) => {
	const { coverImage, title, isFollowing, id, status } = props;

	const [following, setFollowing] = useState<boolean>(isFollowing);
	const { mergeItem } = useAsyncStorage(`${id}`);

	const styles = StyleSheet.create({
		bannerImage: {
			width: "100%",
			height: Dimensions.get("window").height * 0.25,
		},
		titleRow: {
			flexDirection: "row",
			margin: 8,
			padding: 4,
		},
		title: {
			fontSize: 16,
			fontWeight: "600",
			marginBottom: 4,
		},
		image: {
			width: Dimensions.get("window").width * 0.28,
			height: Dimensions.get("window").height * 0.18,
			borderRadius: 6,
		},
	});

	return (
		<Surface style={styles.titleRow}>
			<Image source={{ uri: coverImage.extraLarge }} style={styles.image} />
			<View
				style={{
					flexShrink: 0.8,
					width: "100%",
					marginHorizontal: 4,
					justifyContent: "space-between",
				}}>
				<View>
					<Text
						allowFontScaling
						minimumFontScale={0.65}
						adjustsFontSizeToFit
						numberOfLines={3}
						style={styles.title}>
						{title.romaji}
					</Text>
					{title.english && (
						<Text
							numberOfLines={3}
							allowFontScaling
							adjustsFontSizeToFit
							minimumFontScale={0.75}
							style={{ color: "gray", fontSize: 12, fontWeight: "500" }}>
							{title.english}
						</Text>
					)}
				</View>
				{status !== "FINISHED" && (
					<Button
						style={{
							width: "45%",
							borderRadius: 16,
							transform: [{ scale: 0.8 }],
						}}
						compact
						onPress={() => {
							setFollowing((follow) => !follow);
							mergeItem(JSON.stringify({ isFollowing: !following }));
						}}
						labelStyle={{ fontSize: 14 }}
						uppercase={false}
						mode={following ? "contained" : "outlined"}>
						{following ? "Following" : "Follow"}
					</Button>
				)}
			</View>
		</Surface>
	);
};

interface ContinueProp {
	object: LastWatchingModel;
}

export const ContinueWatchingBlock: FC<ContinueProp> = (props) => {
	const { object } = props;

	const theme = useTheme();
	return (
		<Card style={{ margin: 8 }}>
			<View
				style={{
					overflow: "hidden",
					borderTopLeftRadius: 4,
					borderTopRightRadius: 4,
				}}>
				<Card.Cover
					fadeDuration={1500}
					source={
						object.episodeThumbnail
							? {
									uri: object.episodeThumbnail,
							  }
							: require("../Assets/icon.png")
					}
				/>
				<View
					style={{
						position: "absolute",
						top: 0,
						right: 0,
						bottom: 0,
						left: 0,
					}}>
					<View
						style={{
							position: "absolute",
							justifyContent: "center",
							alignItems: "center",
							top: 0,
							right: 0,
							left: 0,
							bottom: 0,
						}}>
						<Icon
							type={"MaterialIcon"}
							name={"play-arrow"}
							size={100}
							color={"white"}
						/>
					</View>
					<View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
						<ProgressBar progress={0.7} />
					</View>
				</View>
			</View>
			<Card.Title
				subtitle={"Continue Watching"}
				subtitleStyle={{ color: theme.colors.primary }}
				title={`Episode ${object.episodeNumber} - ${object.episodeTitle}`}
				titleNumberOfLines={2}
				titleStyle={{ fontSize: 16, fontWeight: "600" }}
			/>
		</Card>
	);
};

export const TimerDownCard = ({
	episode,
	timeUntilAiring,
}: {
	episode: number;
	timeUntilAiring: number;
}) => {
	const timeUntil = (seconds: number): string => {
		seconds = Number(seconds);
		var d = Math.floor(seconds / (3600 * 24));
		var h = Math.floor((seconds % (3600 * 24)) / 3600);
		var m = Math.floor((seconds % 3600) / 60);
		// var s = Math.floor(seconds % 60);

		var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
		var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
		var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
		// var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
		return dDisplay + hDisplay + mDisplay;
	};

	const styles = StyleSheet.create({
		airs: {
			fontSize: 18,
			fontWeight: "800",
			color: "white",
			marginBottom: 5,
		},
		timer: {
			textAlign: "center",
			fontWeight: "600",
			fontSize: 15,
			marginVertical: 4,
			color: "white",
		},
	});

	return (
		<Card
			style={{
				margin: 8,
				padding: 8,
				backgroundColor: episode && !timeUntilAiring ? "red" : "green",
			}}>
			<Text style={styles.airs}>Airing Information</Text>
			<Text
				numberOfLines={1}
				allowFontScaling
				minimumFontScale={0.8}
				style={styles.timer}>
				Episode {episode} in{" "}
				{episode && !timeUntilAiring ? "Delayed" : timeUntil(timeUntilAiring)}
			</Text>
		</Card>
	);
};
