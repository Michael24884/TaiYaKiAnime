/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, {
	createRef,
	FC,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	ActivityIndicator,
	Button,
	Dimensions,
	LogBox,
	Platform,
	StyleSheet,
	Animated,
	View,
	Modal,
	StatusBar,
	Alert,
} from "react-native";
import Icon from "react-native-dynamic-vector-icons";
import { FlatList } from "react-native-gesture-handler";
import { StretchyScrollView } from "react-native-stretchy";
import { useAnilistRequest, useDetailedHook } from "../../../Hooks";
import {
	heightPercentageToDP,
	widthPercentageToDP,
} from "react-native-responsive-screen";
import {
	AnilistCharacterModel,
	AnilistDetailedGraph,
	AnilistRecommendationPageEdgeModel,
	Media,
} from "../../../Models/Anilist";
import { useSettingsStore, useUserProfiles } from "../../../Stores";
import {
	dateNumToString,
	MapAnilistSeasonsToString,
	MapAnilistSourceToString,
	MapAnilistStatusToString,
} from "../../../Util";
import {
	BaseCards,
	BindTitleBlock,
	DangoImage,
	Divider,
	TaiyakiHeader,
	ThemedButton,
	ThemedCard,
	ThemedSurface,
	ThemedText,
	WatchTile,
} from "../../Components";
import { SynopsisExpander } from "../../Components/header";
import StatusPage from "./StatusPage";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { DetailedDatabaseModel, MyQueueModel } from "../../../Models/taiyaki";
import { useQueueStore, useUpNextStore } from "../../../Stores/queue";
import { StatusCards } from "../../Components/detailedParts";
import DropDownAlert from "../../Components/dropDownAlert";
import { useJikanRequest } from "../../../Hooks/useJikanRequest";
import {
	JikanDetailModel,
	MapJikanRatingTypeToStringObj,
} from "../../../Models/Jikan/JikanBasicModel";
import { AnimatePresence, View as MotiView } from "moti";
import { isTablet } from "react-native-device-info";
import { useTaiyakiTheme } from "../../../Stores/rootStore";
import { useAccentComponentState, useThemeComponentState, useSettingsComponentState } from "../../Components/storeConnect";
import { RatingDecBarChart } from "../../Components/charts";

const { height, width } = Dimensions.get("window");
const ITEM_HEIGHT = height * 0.26;

interface Props {
	route: {
		params: {
			id: number;
			malID?: string;
			embedLink?: string;
			updateRequested?: boolean;
		};
	};
}

LogBox.ignoreLogs(["Aborted"]);

const DetailScreen: FC<Props> = (props) => {
	const { malID } = props.route.params;
	//const settings = useSettingsStore((_) => _.settings);
	const settings = useSettingsComponentState().settings;
	const profiles = useUserProfiles((_) => _.profiles);
	const [statusPageVisible, setStatusPageVisibility] = useState<boolean>(false);
	const navigation = useNavigation();
	const scrollValue = useRef(new Animated.Value(0)).current;
	const dropDownRef = createRef<DropDownAlert>();
	//const theme = useTaiyakiTheme();
	const {theme} = useThemeComponentState();
	const {accent} = useAccentComponentState();
	
	const [id, setID] = useState<number>(props.route.params.id);
	const [malIDState, setMALIDState] = useState<number>(malID);

	const [database, setDatabase] = useState<DetailedDatabaseModel>();

	const {
		query: { data },
		controller,
	} = useAnilistRequest<{ data: { Media: Media } }>(
		"Detailed" + (malID ?? id.toString()),
		AnilistDetailedGraph(id, malID)
	);

	const {
		query: {
			data: jikanData,
			isFetching: jikanDataIsFetching,
			isError: jikanDataIsError,
		},
	} = useJikanRequest<JikanDetailModel>(
		"jikan" + id.toString(),
		`/${malIDState}`
	);

	const detailedHook = useDetailedHook(id, database, data?.data.Media.idMal);
	const addUpNext = useUpNextStore((_) => _.addAll);
	const { queueLength, addAllToQueue } = useQueueStore((_) => _);

	useEffect(() => {
		//getDatabase();
		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		if (data) {
			setID(data.data.Media.id);
			setMALIDState(Number(data.data.Media.idMal));
		}
	}, [data]);

	useEffect(() => {
		navigation.setOptions({
			title: data?.data.Media.title.romaji ?? " ",
		});
	}, [navigation, data]);

	const opacity = scrollValue.interpolate({
		inputRange: [0, height * 0.4],
		outputRange: [0, 1],
		extrapolate: "clamp",
	});

	const AnimatedHeader = Animated.createAnimatedComponent(TaiyakiHeader);

	const styles = StyleSheet.create({
		empty: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
		},
		rowView: { flexDirection: "row" },
		titleView: {
			paddingHorizontal: width * 0.02,
			paddingTop: 10,
			marginBottom: height * 0.03,
			flexShrink: 0.8,
			height: height * 0.14,
		},
		scroller: {
			flex: 1,
			// transform: [{translateY: -height * 0.13}],
		},
		surface: {
			backgroundColor: theme.colors.backgroundColor,
			marginHorizontal: width * 0.025,
			paddingHorizontal: width * 0.03,
			borderRadius: 4,
			...Platform.select({
				android: { elevation: 4 },
				ios: {
					shadowColor: "black",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.2,
					shadowRadius: 5,
				},
			}),
			paddingBottom: 5,
			marginBottom: height * 0.022,
		},
		subTitle: {
			fontSize: heightPercentageToDP(2.5),
			fontWeight: "700",
			marginTop: height * 0.01,
			marginBottom: height * 0.02,
		},
		shadowView: {
			...Platform.select({
				android: { elevation: 4 },
				ios: {
					shadowColor: "black",
					shadowOffset: { width: -1, height: 2 },
					shadowOpacity: 0.3,
					shadowRadius: 5,
				},
			}),
			// position: 'absolute',
			marginTop: -height * 0.07,
			marginLeft: width * 0.04,
		},
		image: {
			width: heightPercentageToDP(17),
			height: Platform.OS === "ios" ? heightPercentageToDP(21) : height * 0.26,
			marginBottom: Platform.OS === "ios" ? undefined : height * 0.03,
		},
		title: {
			fontSize: heightPercentageToDP(2),
			fontWeight: "bold",
		},
		englishTitle: {
			color: "grey",
			fontSize: heightPercentageToDP(1.5),
			fontWeight: "400",
		},
		synopsis: {
			fontSize: heightPercentageToDP(1.6),
		},
		genresContainer: {
			flexDirection: "row",
			flexWrap: "wrap",
		},
		genrePills: {
			margin: 4,
			backgroundColor: accent,
			borderRadius: 4,
			justifyContent: "center",
			padding: 8,
		},
		genreText: {
			color: "white",
			fontSize: heightPercentageToDP(1.7),
			fontWeight: "600",
		},
		infoRowView: {
			justifyContent: "space-around",
		},
		infoRowTitle: {
			textAlign: "center",
			fontSize: heightPercentageToDP(2.5),
			fontWeight: "700",
			color: "grey",
		},
		infoRowData: {
			textAlign: "center",
			fontSize: heightPercentageToDP(1.76),
			fontWeight: "400",
			color: "grey",
			marginVertical: 4,
		},
		infoParentChildWrap: {
			flexWrap: "wrap",
			flexDirection: "row",
			justifyContent: "space-around",
			marginVertical: 15,
		},
		imageItems: {
			height: Platform.OS === "ios" ? heightPercentageToDP(25) : height * 0.3,
			width: heightPercentageToDP(15),
			marginHorizontal: width * 0.02,
			marginBottom: 5,
		},
		titleItems: {
			fontSize: heightPercentageToDP(1.7),
			marginTop: 8,
		},
	});

	const { getItem, mergeItem, removeItem } = useAsyncStorage(`${id}`);

	const getDatabase = async () => {
		const file = await getItem();
		if (file) {
			const model = JSON.parse(file) as DetailedDatabaseModel;
			setDatabase(model);
		}
	};

	useEffect(() => {
		if (props.route.params.embedLink) {
			mergeItem(
				JSON.stringify({
					title: data?.data.Media.title.romaji,
					coverImage: data?.data.Media.coverImage.extraLarge,
				})
			).finally(getDatabase);
		}
	}, [props.route.params.embedLink]);

	useFocusEffect(
		useCallback(() => {
			getDatabase();
		}, [id])
	);

	//Save the simkl id if its missing from the database
	useEffect(() => {
		const saveIDS = async () => {
			if (detailedHook && detailedHook.ids && database && !database.ids.simkl) {
				await mergeItem(
					JSON.stringify({
						ids: detailedHook.ids,
					})
				);
				setDatabase((database) => {
					if (database) {
						database.ids = { ...database.ids, ...detailedHook.ids };
						database.totalEpisodes = detailedHook.data.length;
						return database;
					}
				});
			}
		};
		saveIDS();
	}, [detailedHook]);

	useEffect(() => {
		const saveTotalEpisodes = async () => {
			if (
				detailedHook &&
				database &&
				(!database.totalEpisodes || database.totalEpisodes === 0)
			) {
				//Update the total episodes, in case an airing anime has finally updated amount of episodes
				await mergeItem(
					JSON.stringify({ totalEpisodes: data?.data?.Media?.episodes ?? 0 })
				);
			}
		};
		saveTotalEpisodes();
	}, [data]);

	if (!data || !id)
		return (
			<ThemedSurface
				style={[
					styles.empty,
					{ backgroundColor: theme.colors.backgroundColor },
				]}
			>
				<ActivityIndicator />
			</ThemedSurface>
		);

	const IconRow = (name: string | number, data: string) => {
		return (
			<View style={{ justifyContent: "space-between", alignItems: "center" }}>
				{typeof name === "string" ? (
					<Icon name={name} type={"MaterialIcons"} color={"grey"} size={heightPercentageToDP(3)} />
				) : (
					<ThemedText
						shouldShrink
						numberOfLines={1}
						style={styles.infoRowTitle}
					>
						{(name ?? "N/A").toString()}
					</ThemedText>
				)}
				<ThemedText style={styles.infoRowData}>{data}</ThemedText>
			</View>
		);
	};

	const InfoParentChild = (title: string, data: string) => {
		return (
			<View
				style={{
					width: width * 0.27,
					height: height * 0.05,
					marginHorizontal: width * 0.01,
					marginVertical: height * 0.016,
				}}
			>
				<ThemedText style={{ textAlign: "center", fontSize: heightPercentageToDP(1.55) }}>
					{title}
				</ThemedText>
				<ThemedText
					style={{
						textAlign: "center",
						marginTop: 4,
						color: "grey",
						fontSize: heightPercentageToDP(1.55),
					}}
				>
					{data ?? "N/A"}
				</ThemedText>
			</View>
		);
	};

	const _renderCharacters = ({ item }: { item: AnilistCharacterModel }) => {
		const { name, image, id } = item;
		return (
			<View style={[styles.imageItems]}>
				<DangoImage
					url={image.large}
					style={{ height: "74%", width: "100%" }}
				/>
				<ThemedText style={styles.titleItems} numberOfLines={2}>
					{name.full}
				</ThemedText>
			</View>
		);
	};
	const _renderRec = ({
		item,
	}: {
		item: AnilistRecommendationPageEdgeModel;
	}) => {
		const { title, coverImage, id } = item.node.mediaRecommendation;
		return (
			<View style={{ marginTop: heightPercentageToDP(1.2) }}>
				<BaseCards image={coverImage.extraLarge} title={title.romaji} id={id} />
			</View>
		);
	};

	const _addUpNext = () => {
		if (!database || !detailedHook) return;
		if (queueLength === 0) {
			const next =
				database.lastWatching?.episode ??
				database.lastWatching?.data?.episode ??
				1;
			const portion: number = detailedHook.data.findIndex(
				(i) => i.episode === next
			);
			if (portion + 1 < detailedHook.data.length) {
				addUpNext(detailedHook.data.slice(portion + 1));
			}
		}
	};

	const {
		bannerImage,
		coverImage,
		title,
		description,
		genres,
		idMal,
		status,
		episodes,
		meanScore,
		format,
		popularity,
		source,
		hashtag,
		countryOfOrigin,
		duration,
		season,
		seasonYear,
		characters,
		recommendations,
		startDate,
		endDate,
		nextAiringEpisode,
		stats,
		relations,
	} = data.data.Media;

	const VerticalDivider = () => {
		return (
			<View
				style={{
					height: "50%",
					alignSelf: "center",
					width: widthPercentageToDP(0.25),
					backgroundColor: "grey",
					borderRadius: 6,
				}}
			/>
		);
	};

	const RatingRowBlock = (
		type: "RATING" | "SCORE" | "RANK"
	): JSX.Element | null => {
		if (!jikanData || !jikanData.data) return null;
		const { rating, score, rank } = jikanData.data;
		return (
			<View
				style={{
					flex: 1 / 3,
					paddingHorizontal: heightPercentageToDP(1),
					alignItems: "center",
					justifyContent: "space-around",
				}}
			>
				<ThemedText
					style={{
						textAlign: "center",
						fontWeight: "800",
						fontSize: heightPercentageToDP(2.75),
					}}
				>
					{type === "RATING"
						? MapJikanRatingTypeToStringObj.get(rating)?.rating ?? "N/A"
						: type === "SCORE"
						? (score ?? 'N/A') 
						: "#" + rank}
				</ThemedText>
				<ThemedText
					style={{
						textAlign: "center",
						fontSize: heightPercentageToDP(1.45),
						fontWeight: "500",
						color: "#bcbcbc",
					}}
				>
					{type === "RATING"
						? MapJikanRatingTypeToStringObj.get(rating)?.description ?? 'Rating Unavailable'
						: type === "SCORE"
						? "Mal Score"
						: "Ranked"}
				</ThemedText>
			</View>
		);
	};

	const PageOne = () => (
		<StretchyScrollView
			style={{ marginBottom: height * 0.1 }}
			backgroundColor={theme.colors.backgroundColor}
			image={
				bannerImage
					? { uri: bannerImage }
					: require("../../../assets/images/icon_round.png")
			}
			imageHeight={height * 0.3}
			imageResizeMode={"cover"}
			showsVerticalScrollIndicator={false}
			scrollEventThrottle={16}
			onScroll={(position) => scrollValue.setValue(position)}
		>
			<View>
				<View style={styles.rowView}>
					<View style={styles.shadowView}>
						<DangoImage url={coverImage.extraLarge} style={styles.image} />
					</View>
					<View
						style={[
							styles.titleView,
							// {backgroundColor: theme.colors.backgroundColor},
						]}
					>
						<ThemedText shouldShrink numberOfLines={3} style={styles.title}>
							{title.romaji}
						</ThemedText>
						{title.english ? (
							<ThemedText
								shouldShrink
								style={styles.englishTitle}
								numberOfLines={3}
							>
								{title.english}
							</ThemedText>
						) : null}
					</View>
				</View>

				<View
					style={{
						flexDirection: "row",
						height: jikanData && jikanData.data || jikanDataIsFetching ?  heightPercentageToDP(10) : 0, 
						justifyContent: "center",
						marginBottom: heightPercentageToDP(1.4),
						backgroundColor: theme.colors.secondaryBackgroundColor,
						borderRadius: 6,
						width: "95%",
						alignSelf: "center",
					}}
				>
					{jikanDataIsFetching ? (
						<ActivityIndicator key={"indicator"} />
					) : jikanDataIsError ? (
						<>
							<ThemedText
								style={{
									fontWeight: "800",
									fontSize: heightPercentageToDP(1.3),
								}}
							>
								Jikan could not fetch data for this anime
							</ThemedText>
						</>
					) : (
						jikanData && jikanData.data ? <>
							{RatingRowBlock("RATING")}
							{VerticalDivider()}
							{RatingRowBlock("SCORE")}
							{VerticalDivider()}
							{RatingRowBlock("RANK")}
						</> : null
					)}
				</View>
				{/* //Synopsis */}
				<SynopsisExpander
					synopsis={description}
					nextAiringEpisode={nextAiringEpisode}
				/>

				<RatingDecBarChart data={stats.scoreDistribution} />

				{/* //Bind or Episode */}
				{!database || !database.link ? (
					<BindTitleBlock title={title.romaji} id={id} status={status} />
				) : detailedHook ? (
					!detailedHook.error ? (
						<WatchTile
							episode={
								detailedHook.data.find((i) => {
									if (settings?.sync?.overrideWatchNext) {
										return (
											i.episode ===
											(database.lastWatching?.episode ??
												database.lastWatching?.data?.episode ??
												1)
										);
									}
									return (
										i.episode ===
										(database.lastWatching?.episode ??
											database.lastWatching?.data?.episode ??
											1)
									);
								}) ?? detailedHook.data[detailedHook.data.length - 1]
							}
							detail={database}
							onPress={() => {
								navigation.navigate("EpisodesList", {
									episodes: detailedHook.data,
									database: database,
									updateRequested: () => {
										//if (value) getDatabase();
									},
								});
							}}
							onPlay={() => {
								_addUpNext();
								const nowPlaying =
									detailedHook.data.find(
										(i) =>
											i.episode ===
											(database.lastWatching?.episode ??
												database.lastWatching?.data?.episode ??
												1)
									) ?? detailedHook.data.splice(-1)[0];
								const episode: MyQueueModel = {
									detail: database,
									episode: nowPlaying,
								};
								// MOVE TO VIDEO PAGE
								navigation.navigate("Video", {
									episode,
									updateRequested: () => {
										//  getDatabase();
									},
								});
							}}
							onContinueWatching={() => {
								_addUpNext();
								const episode: MyQueueModel = {
									detail: database,
									episode: database.lastWatching.data,
								};
								navigation.navigate("Video", {
									episode,
									updateRequested: () => {
										// getDatabase();
									},
								});
							}}
							isFollowing={database?.isFollowing}
							onFollow={async (following) => {
								console.log("following", following);
								setDatabase((database) => {
									if (database) return { ...database, isFollowing: following };
								});
								await mergeItem(JSON.stringify({ isFollowing: following }));
							}}
							onRemoveSavedLink={async () => {
								Alert.alert(
									"Are you sure?",
									'Removing saved link will allow you to select a new link. This will remove the current "continue watching" and notifications',
									[
										{
											text: "Cancel",
										},
										{
											text: "Remove",
											onPress: async () => {
												await removeItem();
												setDatabase(undefined);
												detailedHook.clearLinks();
											},
											style: "destructive",
										},
									]
								);
							}}
							onAddAllToQueue={() => {
								const queue: {
									key: string;
									data: MyQueueModel;
								}[] = detailedHook.data.map((i) => ({
									key: database.title,
									data: { episode: i, detail: database },
								}));
								addAllToQueue(queue);
								dropDownRef.current?.show({
									title: "Added to Queue",
									message: title.romaji + " was added successfully",
									duration: 3200,
								});
							}}
							onAddUnwatchedToQueue={() => {
								const check = database.lastWatching.episode;
								if (!check) {
									const queue: {
										key: string;
										data: MyQueueModel;
									}[] = detailedHook.data.map((i) => ({
										key: database.title,
										data: { episode: i, detail: database },
									}));
									addAllToQueue(queue);
								} else {
									const queue: {
										key: string;
										data: MyQueueModel;
									}[] = detailedHook.data.slice(check).map((i) => ({
										key: database.title,
										data: { episode: i, detail: database },
									}));
									addAllToQueue(queue);
								}
							}}
						/>
					) : (
						<ThemedCard style={{ padding: 8 }}>
							<ThemedText
								style={{
									fontWeight: "700",
									textAlign: "center",
									fontSize: 18,
								}}
							>
								An error has occured. Reason:
							</ThemedText>
							<ThemedText
								style={{
									fontWeight: "700",
									textAlign: "center",
									fontSize: 16,
								}}
							>
								{detailedHook.error}
							</ThemedText>
							<ThemedButton
								title={"Retry"}
								onPress={detailedHook.retry}
								color={"red"}
							/>
						</ThemedCard>
					)
				) : null}

				{/** Detects amount of fillers */}
				{detailedHook ? (
					<View
						style={{
							flexDirection: 'row',
							borderRadius: 2,
							alignSelf: "center",
							backgroundColor: theme.colors.secondaryBackgroundColor,
							padding: widthPercentageToDP(2.5),
							paddingHorizontal: widthPercentageToDP(5),
							width: "95%",
							marginBottom: heightPercentageToDP(2),
							justifyContent: 'center'
						}}
					>
						<ThemedText
							style={{
								textAlign: "center",
								fontWeight: "600",
								fontSize: heightPercentageToDP(2.25),
								marginRight: 5
							}}
						>
							{detailedHook?.fillerCount === 0
								? "This anime has no fillers".toLocaleUpperCase()
								: `Found ${detailedHook?.fillerCount} filler episodes`.toLocaleUpperCase()}  
						</ThemedText>
						{detailedHook.fillerCount > 0 ? <ThemedText
							style={{
								textAlign: "center",
								fontWeight: "600",
								fontSize: heightPercentageToDP(2.25),
							}}
						>
						 = {((detailedHook.fillerCount / detailedHook.data.length) * 100).toFixed(0)}%
						</ThemedText>: null}
					</View>
				) : null}

				{profiles.length > 0 ? (
					<StatusCards onPress={() => setStatusPageVisibility(true)} />
				) : null}

				{/* //Genres */}
				{genres.length > 0 ? (
					<View style={styles.surface}>
						<ThemedText style={styles.subTitle}>Genres</ThemedText>
						<View style={styles.genresContainer}>
							{genres.map((i) => (
								<View key={i} style={styles.genrePills}>
									<ThemedText style={styles.genreText}>{i}</ThemedText>
								</View>
							))}
						</View>
					</View>
				) : null}

				{/* //More Info */}
				<View style={styles.surface}>
					<ThemedText style={styles.subTitle}>More Information</ThemedText>
					<View style={[styles.rowView, styles.infoRowView]}>
						{IconRow(Number((meanScore * 0.1).toFixed(1)), "Mean")}
						{IconRow("new-releases", MapAnilistStatusToString.get(status)!)}
						{IconRow(episodes, episodes === 1 ? "Episode" : "Episodes")}
						{IconRow("tv", format)}
					</View>
					<Divider />
					<View style={styles.infoParentChildWrap}>
						{InfoParentChild("Origin Country", countryOfOrigin)}
						{InfoParentChild("Hashtag", hashtag)}
						{InfoParentChild(
							"Source",
							MapAnilistSourceToString.get(source) ?? "???"
						)}
						{InfoParentChild("Duration", `${duration} minutes`)}
						{InfoParentChild("Anime ID", id.toString())}
						{InfoParentChild("Popularity", popularity.toLocaleString())}
						{InfoParentChild(
							"Season",
							(MapAnilistSeasonsToString.get(season) ?? "?") +
								" " +
								(seasonYear ?? "N/A").toString()
						)}
						{InfoParentChild("Start Date", dateNumToString(startDate))}
						{InfoParentChild("End Date", dateNumToString(endDate))}
					</View>
				</View>
				{characters.nodes.length > 0 ? (
					<View style={[styles.surface]}>
						<View style={[styles.rowView, { justifyContent: "space-between", alignItems: 'center' }]}>
							<ThemedText style={styles.subTitle}>Characters</ThemedText>
							<View style={{transform: [{scale: heightPercentageToDP(0.12)}]}}>
							<Button
								title={"See All"}
								color={theme.colors.accent}
								onPress={() => navigation.push("Characters", { id })}
							/>
							</View>
						</View>
						<FlatList
							data={characters.nodes}
							renderItem={_renderCharacters}
							keyExtractor={(item) => item.id.toString()}
							horizontal
							contentContainerStyle={{
								height: Platform.OS === "ios" ? height * 0.26 : height * 0.3,
							}}
							getItemLayout={(data, index) => ({
								length: ITEM_HEIGHT,
								offset: ITEM_HEIGHT * index,
								index,
							})}
						/>
					</View>
				) : null}

				{relations.edges.filter((i) => i.relationType !== 'ALTERNATIVE').filter((i) => i.relationType !== 'ADAPTATION' ).length > 0 ? <ThemedButton onPress={() => navigation.push('Relations', {relations})} title={'Relations'} />: null} 

				{/* //Recommendations */}
				{recommendations.edges.length > 0 ? (
					<View
						style={[
							styles.surface,
							{ paddingBottom: 12, justifyContent: "center", marginBottom: 18 },
						]}
					>
						<View style={[styles.rowView, { justifyContent: "space-between", alignItems: 'center' }]}>
							<ThemedText style={styles.subTitle}>Recommendations</ThemedText>
							<View style={{transform: [{scale: heightPercentageToDP(0.12)}]}}>
							<Button
								title={"See All"}
								color={theme.colors.accent}
								onPress={() => navigation.push("Recommendations", { id })}
							/>
							</View>
						</View>
						<FlatList
							data={recommendations.edges.filter(
								(i) => i.node.mediaRecommendation
							)}
							renderItem={_renderRec}
							keyExtractor={(item) =>
								item.node.mediaRecommendation.id.toString()
							}
							horizontal
							contentContainerStyle={{ height: ITEM_HEIGHT + height * 0.13 }}
							getItemLayout={(data, index) => ({
								length: ITEM_HEIGHT,
								offset: ITEM_HEIGHT * index,
								index,
							})}
						/>
					</View>
				) : null}
			</View>
		</StretchyScrollView>
	);

	return (
		<>
			<StatusBar
				backgroundColor={theme.colors.primary}
				barStyle={"light-content"}
			/>
			<DropDownAlert ref={dropDownRef} />
			<Modal
				visible={statusPageVisible}
				hardwareAccelerated
				presentationStyle={"formSheet"}
				animationType={"slide"}
			>
				<StatusPage
					totalEpisode={episodes}
					onClose={() => setStatusPageVisibility(false)}
					banner={bannerImage ?? coverImage.extraLarge}
					key={"status"}
					idMal={idMal}
					id={id}
					title={title.romaji}
				/>
			</Modal>
			<AnimatedHeader
				onPress={() => navigation.goBack()}
				opacity={opacity}
				color={theme.dark ? theme.colors.card : theme.colors.primary}
				headerColor={theme.colors.text}
			/>
			<View
				style={{
					height: isTablet() ? (height + heightPercentageToDP(4)) : height,
					marginTop: Platform.OS === "ios" ? isTablet() ? -heightPercentageToDP(13) : -height * 0.13 : -height * 0.16,
					
				}}
			>
				{PageOne()}
			</View>
			{/* <StatusPage
          banner={bannerImage ?? coverImage.extraLarge}
          key={'status'}
          anilistEntry={mappedEntry}
          idMal={idMal}
          id={id}
          title={title.romaji}
        /> */}
		</>
	);
};

export default DetailScreen;
