/**
 * @format
 */
import React from "react";
import { AppRegistry, StatusBar, Appearance } from "react-native";
import {
	Provider as PaperProvider,
	DefaultTheme,
	DarkTheme,
} from "react-native-paper";
import { name as appName } from "./app.json";
import App from "./App";
import { default as colorTheme } from "./Util/custom-theme.json";
import TaiyakiVideoPlayer from "./Components/video_player";

export default function Main() {
	const scheme = Appearance.getColorScheme();

	let theme;

	if (scheme === "light")
		theme = {
			...DefaultTheme,
			colors: {
				...DefaultTheme.colors,
				primary: colorTheme["color-primary-700"],
				accent: "white",
			},
		};
	else
		theme = {
			...DarkTheme,
			colors: {
				...DarkTheme.colors,
				accent: "white",
			},
		};

	return (
		<PaperProvider theme={theme}>
			<TaiyakiVideoPlayer />
		</PaperProvider>
	);
	return (
		<PaperProvider theme={theme}>
			<StatusBar barStyle={"light-content"} />
			<App />
		</PaperProvider>
	);
}

AppRegistry.registerComponent(appName, () => Main);
