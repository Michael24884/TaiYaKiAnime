import React, { useState, useEffect, createRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Image } from "react-native-paper/lib/typescript/src/components/Avatar/Avatar";
import { TaiyakiImage } from "./taiyaki_view";

//@ts-ignore
import Video from "react-native-af-video-player";

const publicTestLink =
	"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const TaiyakiVideoPlayer = () => {
	const playerController = createRef<Video>();

	const styles = StyleSheet.create({
		fullScreen: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			zIndex: 0,
		},
		notFullScreen: {
			width: "100%",
			position: "relative",
			height: Dimensions.get("window").height * 0.22,
		},
		//Aspect Ratio required
		innerView: {
			height: "100%",
			width: "100%",
		},
	});

	const [isFullscreen, toggleFullScreen] = useState<boolean>(true);

	useEffect(() => {}, [isFullscreen]);

	return (
		<View
			style={[
				isFullscreen ? styles.fullScreen : styles.notFullScreen,
				{ backgroundColor: "black" },
			]}>
			<View style={styles.innerView}>
				<Video autoPlay url={publicTestLink} ref={playerController} />
			</View>
		</View>
	);
};

export default TaiyakiVideoPlayer;
