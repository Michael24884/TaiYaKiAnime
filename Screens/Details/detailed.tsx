import React, { ComponentType, memo, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import {
	TaiyakiParsedText,
	TaiyakiScrollView,
	TaiyakiView,
} from "../../Components/taiyaki_view";
import { AnilistDetailedModel } from "../../Models/Anilist/basic_models";
import { StretchyScrollView } from "react-native-stretchy";
import {
	ContinueWatchingBlock,
	TimerDownCard,
	TitleRow,
} from "../../Components/base_cards";
import { InformationRows } from "../../Components/rows";
import { BaseRows } from "../../Components/base_rows";
import { DetailedDatabaseModel } from "../../Models/Taiyaki/models";

interface Props {
	id: number;
	data: AnilistDetailedModel | undefined;
	database: DetailedDatabaseModel | undefined;
}
const DetailedMainScreen: ComponentType<Props> = (props) => {
	if (!props.data) {
		return (
			<TaiyakiView
				style={{
					justifyContent: "center",
					alignItems: "center",
					height: "100%",
				}}>
				<ActivityIndicator />
			</TaiyakiView>
		);
	}

	const theme = useTheme();
	const { data, database, id } = props;

	const {
		coverImage,
		status,
		nextAiringEpisode,
		genres,
		season,
		seasonYear,
		title,
		duration,
		episodes,
		format,
		countryOfOrigin,
		bannerImage,
		description,
		startDate,
		endDate,
		source,
		tags,
		recommendations,
	} = data;

	const _chooseScroll = (props: any) => {
		return useMemo(() => {
			if (bannerImage)
				return (
					<StretchyScrollView
						image={{ uri: bannerImage }}
						backgroundColor={theme.colors.background}
						imageHeight={Dimensions.get("window").height * 0.25}>
						<Surface>{props.children}</Surface>
					</StretchyScrollView>
				);
			else return <TaiyakiScrollView>{props.children}</TaiyakiScrollView>;
		}, []);
	};

	const _statusString = (status: string): { status: string; color: string } => {
		switch (status) {
			case "FINISHED":
				return { status: "Finished", color: "orange" };
			case "NOT_YET_RELEASED":
				return { status: "Not Yet Released", color: "red" };
			case "RELEASING":
				return { status: "Releasing", color: "blue" };
			default:
				throw new Error("This status is not configured");
		}
	};

	const _dateString = ({
		month,
		day,
		year,
	}: {
		month?: number;
		day?: number;
		year?: number;
	}): string => {
		let date = "";
		date = `${month ?? "???"}-${day ?? "???"}-${year ?? "???"}`;
		return date;
	};
	console.log(database);

	return (
		<_chooseScroll>
			<TitleRow
				status={status}
				coverImage={coverImage}
				title={title}
				isFollowing={database?.isFollowing ?? false}
				id={id}
			/>
			{database && database.lastWatchingEpisode && (
				<ContinueWatchingBlock object={database.lastWatchingEpisode} />
			)}
			{nextAiringEpisode && (
				<TimerDownCard
					episode={nextAiringEpisode.episode}
					timeUntilAiring={nextAiringEpisode.timeUntilAiring}
				/>
			)}
			<Surface style={styles.surface}>
				<Text style={styles.subtitle}>Synopsis</Text>
				<TaiyakiParsedText style={styles.description} color={theme.colors.text}>
					{description ??
						"No synopsis provided for this anime yet. Check back later."}
				</TaiyakiParsedText>
			</Surface>

			{genres.length > 0 && (
				<Surface style={styles.surface}>
					<Text style={styles.subtitle}>Genres</Text>
					<View
						style={{ flexWrap: "wrap", width: "100%", flexDirection: "row" }}>
						{genres.map((i) => {
							return (
								<View
									key={i}
									style={{
										marginHorizontal: 8,
										marginVertical: 4,
										backgroundColor: theme.colors.primary,
										borderRadius: 6,
										padding: 8,
									}}>
									<Text style={{ color: theme.colors.accent }}>{i}</Text>
								</View>
							);
						})}
					</View>
				</Surface>
			)}

			<Surface style={styles.surface}>
				<Text style={styles.subtitle}>Other Information</Text>
				<InformationRows
					title={"Status"}
					data={_statusString(status).status}
					color={_statusString(status).color}
				/>
				<InformationRows title={"Season"} data={`${season} ${seasonYear}`} />
				<InformationRows title={"Format"} data={format} />
				<InformationRows
					title={"Source"}
					data={source?.replace(/_/g, " ") ?? "n/a"}
				/>
				<InformationRows title={"Episodes"} data={`${episodes ?? "n/a"}`} />
				<InformationRows title={"Origin"} data={countryOfOrigin} />
				<InformationRows
					title={"Duration"}
					data={`${duration ?? "??"}` + " minutes"}
				/>
				<InformationRows title={"Started"} data={_dateString(startDate)} />
				<InformationRows title={"Ended"} data={_dateString(endDate)} />
			</Surface>

			{tags.length > 0 && (
				<Surface style={styles.surface}>
					<Text style={styles.subtitle}>Tags</Text>
					<View
						style={{ flexWrap: "wrap", width: "100%", flexDirection: "row" }}>
						{tags.map((i) => {
							return (
								<View
									key={i.name}
									style={{
										marginHorizontal: 8,
										marginVertical: 4,
										backgroundColor: theme.colors.primary,
										borderRadius: 6,
										overflow: "hidden",
										flexDirection: "row",
									}}>
									<View style={{ margin: 8 }}>
										<Text style={{ color: theme.colors.accent }}>{i.name}</Text>
									</View>
									<View style={{ backgroundColor: "#00a6fb", padding: 8 }}>
										<Text
											style={{
												color: "white",
												fontSize: 13,
												fontWeight: "600",
											}}>
											{i.rank.toString() + "%"}
										</Text>
									</View>
								</View>
							);
						})}
					</View>
				</Surface>
			)}

			{recommendations.nodes.length > 0 && (
				<BaseRows
					rowTitle={"Recommendations"}
					data={recommendations.nodes.map((i) => ({
						id: i.mediaRecommendation.id,
						title:
							i.mediaRecommendation.title.romaji ??
							i.mediaRecommendation.title.english,
						image: i.mediaRecommendation.coverImage.extraLarge,
						malID: i.mediaRecommendation.idMal,
					}))}
				/>
			)}
		</_chooseScroll>
	);
};

const styles = StyleSheet.create({
	description: {
		fontSize: 13,
		fontWeight: "400",
	},
	subtitle: {
		fontWeight: "800",
		fontSize: 19,
		marginBottom: 8,
	},

	surface: {
		margin: 8,
		padding: 8,
	},
});

const _arePropsEqual = (op: Props, np: Props): boolean => {
	return op.data === np.data && op.database === np.database;
};
export default memo(DetailedMainScreen, _arePropsEqual);
