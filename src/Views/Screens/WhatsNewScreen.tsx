import React, { createRef, FC, useContext, useEffect } from "react";
import { ImageSourcePropType, StyleSheet, View, Image, StyleProp, ImageStyle } from "react-native";
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
	imageStyles?: StyleProp<ImageStyle>
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
		//modalRef.current?.open();
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
					title: 'Taiyaki on the Big Screen',
					description: 'Taiyaki is (finally) compatible with the native IPad size',
					image: require('../../assets/whatsNew/sagiriIpad.jpg'),
					imageStyles: {
						height: heightPercentageToDP(35),
						width: '100%'
					}
				},
				{
					title:
						"Get informed if an anime contains fillers or recap episodes",
					description:
						'For the brave that watch fillers "for fun" and for those who would rather not waste time. Or if in any rare case you were in a four year coma and forgot the entire anime',
					image: require("../../assets/whatsNew/fillerPrev.png"),
					comments:
						"This is a beta feature. If it's incorrect well, you've been warned",
				}, 
				{
					description: 'If an episode does not have a synopsis it will use Jikan as a fallback',
				},
				{
					description: 'Added age ratings to Detail Page',
				},
				{
					title: "Where do all the ratings go?",
					description: 'Score Distribution chart in Detail Page added to ensure you know where all the good ratings are at',
					image: require('../../assets/whatsNew/scorePrev.jpg'),
					imageStyles: {
						width: "95%",
		height: heightPercentageToDP(75),
					}
				},
				{
					title: 'Where to next Chief?',
					description: "Relations look upgraded so it's much easier to know where to go next",
					image: require('../../assets/whatsNew/relationsPrev.png'),
					comments: 'Or if you ever feel the need to take a break from the main story'
				},
				{
					description: 'Added placeholder image for URL images'
				},
				{
					title: 'Some new sources',
					description: 'Implemented Shiro. Special thanks to @Arjix. 🎉'
				}
			],
		},
		{
			title: 'Other',
			data: [
				{
					description: 'Currently disabled Weeb Party, until certain issues are resolved'
				},
			]
		}
	];

	const renderSection = ({ item }: { item: SectionData }) => {
		const { title, video, description, image, comments, imageStyles } = item;
		return (
			<View>
				{title ? <ThemedText style={styles.title}>{title}</ThemedText> : null}
				<ThemedText style={styles.description}>• {description}</ThemedText>
				{image ? (
					<Image source={image} resizeMode={"contain"} style={ [imageStyles||styles.image, {marginVertical: heightPercentageToDP(2)}]} />
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
		marginTop: heightPercentageToDP(1.7)
	},
	description: {
		marginVertical: heightPercentageToDP(1),
		fontSize: heightPercentageToDP(1.6),
		marginBottom: heightPercentageToDP(1.2)
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
