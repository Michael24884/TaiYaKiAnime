import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Button, Divider, Text } from "react-native-paper";
import { Trackers } from "../Models/Taiyaki/models";
import { TrackersToNative } from "../Util/maps";

interface AuthCardProps {
	image?: string;
	username?: string;
	tracker: Trackers;
	signIn: () => void;
}

export const AuthenticationCards: FC<AuthCardProps> = (props) => {
	const { image, username, tracker, signIn } = props;
	const styles = StyleSheet.create({
		shadow: {
			shadowOffset: { width: 0, height: 0 },
			shadowOpacity: 0.25,
			shadowColor: "black",
			shadowRadius: 5,
		},
		card: {
			borderRadius: 6,
			flexDirection: "row",
			margin: 8,
		},
		username: {
			padding: 8,
			fontWeight: "700",
			fontSize: 18,
		},
	});

	return (
		<View style={styles.shadow}>
			<View style={styles.card}>
				<Avatar.Image
					source={image ? { uri: image } : require("../Assets/icon.png")}
				/>
				<Text style={styles.username}>
					{username ?? TrackersToNative.get(tracker)}
				</Text>
				<Divider />
				<Button onPress={signIn}>
					<Text>{username ? "Sign Out" : "Sign In"}</Text>
				</Button>
			</View>
		</View>
	);
};
