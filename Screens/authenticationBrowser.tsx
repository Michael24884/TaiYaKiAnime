import InAppBrowser from "react-native-inappbrowser-reborn";
import { AuthConfig } from "../Models/Taiyaki/models";
import { default as colorTheme } from "../Util/custom-theme.json";
import AsyncStorage from "@react-native-community/async-storage";
import { Bearer, store } from "../Util/store";

export const authenticateLink = async (config: AuthConfig) => {
	try {
		if (await InAppBrowser.isAvailable()) {
			const { authUri, redirectUri, tracker } = config;
			const result = await InAppBrowser.openAuth(authUri, redirectUri, {
				toolbarColor: colorTheme["color-primary-700"],
				preferredControlTintColor: "white",
				dismissButtonStyle: "cancel",
				showTitle: true,
				modalEnabled: false,
			});
			//@ts-ignore
			const { url, type } = result;
			let code: string = "";
			if (type === "success") {
				switch (tracker) {
					case "Anilist":
						const match = (url as string).match(/access_token=([^&]+)/m);
						if (match) {
							const _bearer: Bearer = {
								tracker: "Anilist",
								bearerToken: match[1],
								userID: 0,
							};
							console.log(match[1]);
							AsyncStorage.setItem("auth_keys", JSON.stringify(_bearer), () => {
								console.log("saved");
								store.dispatch("update_tokens", {
									token: match[1],
									tracker: "Anilist",
								});
							});
						}
						break;
				}
			}
		}
	} catch (e) {
		console.log(`[Taiyaki Auth Error: ${e.toString()}]`);
	}
};
