import React, { createRef, FC, useContext, useEffect } from "react";
import { ImageSourcePropType, StyleSheet, View, Image } from "react-native";
import { Modalize } from "react-native-modalize";
import { heightPercentageToDP } from "react-native-responsive-screen";
import Video from "react-native-video";
import { useTheme } from "../../Stores";
import { ThemedSurface, ThemedText } from "../Components";
import {GlobalContext} from '../../App';

type SectionTitle = "What's New" | "Bug Fixes" | "Other";

type SectionData = {
	title?: string;
	description: string;
	image?: ImageSourcePropType;
	video?: NodeRequire;
	comments?: string;
};

type SectionConstructor = {
	title: SectionTitle;
	data: SectionData[];
};

interface Props {
	open: boolean;
	onClose: () => void;
}

const WhatsNewScreen: FC<Props> = (props) => {
	const modalRef = useContext(GlobalContext).whatsNewRef;
	const {open} = props;
	const theme = useTheme((_) => _.theme);
	
	useEffect(() => {
		if (open) modalRef.current?.open();
	}, [open]);

	const data: SectionConstructor[] = [
		{
			title: "What's New",
			data: [
				{
					title: "🎉 Introducing Jikan V4 🎉",
					description: "Now with the power of the Jikan API!",
					video: require("../../assets/whatsNew/JikanPrev.mp4"),
				},
				{
					title:
						"Taiyaki will inform you if an anime contains fillers or recap episodes",
					description:
						'For the brave that watch fillers "for fun" and for those who would rather not waste time. Or if in any rare case you were in a four year coma and forgot the entire anime',
					image: require("../../assets/whatsNew/fillerPrev.png"),
					comments:
						"This is a beta feature. If it's incorrect well, you've been warned",
				}, 
				{
					description: 'If an episode does not have a synopsis it, will use Jikan as a fallback',
				}
			],
		},
	];

	const renderSection = ({ item }: { item: SectionData }) => {
		const { title, video, description, image, comments } = item;
		return (
			<View>
				{title ? <ThemedText style={styles.title}>{title}</ThemedText> : null}
				<ThemedText style={styles.description}>• {description}</ThemedText>
				{image ? (
					<Image source={image} resizeMode={"contain"} style={styles.image} />
				) : null}
				{video ? (
					<Video
						muted
						playInBackground
						playWhenInactive
						disableFocus
						source={video}
						repeat
						rate={0.75}
						style={styles.video}
					/>
				) : null}
				{comments ? (
					<ThemedText style={styles.comments}>{comments}</ThemedText>
				) : null}
			</View>
		);
	};

	return (
		<Modalize
			ref={modalRef}
			modalStyle={{
				backgroundColor: theme.colors.backgroundColor,
				padding: heightPercentageToDP(2),
			}}
			onClose={props.onClose}
			rootStyle={styles.view}
			sectionListProps={{
				showsVerticalScrollIndicator: false,
				sections: data,
				renderItem: renderSection,
				keyExtractor: (item) => item.description,
				renderSectionHeader: ({ section: { title } }) => (
					<ThemedText
						style={{
							fontSize: heightPercentageToDP(2),
							fontWeight: "bold",
							marginBottom: heightPercentageToDP(1),
							backgroundColor: theme.colors.backgroundColor,
							paddingVertical: heightPercentageToDP(2),
						}}
					>
						{title}
					</ThemedText>
				),
			}}
		/>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: "center",
	},
	title: {
		fontWeight: "700",
		fontSize: heightPercentageToDP(2),
		textAlign: "center",
	},
	description: {
		marginVertical: heightPercentageToDP(0.9),
		fontSize: heightPercentageToDP(1.6),
	},
	image: {
		width: "95%",
		height: heightPercentageToDP(85),
	},
	video: {
		height: heightPercentageToDP(30),
		width: "95%",
		alignSelf: "center",
		marginVertical: heightPercentageToDP(2),
	},
	comments: {
		color: "grey",
		fontSize: heightPercentageToDP(1.7),
		fontWeight: "500",
		marginVertical: heightPercentageToDP(2),
	},
});

export default WhatsNewScreen;
