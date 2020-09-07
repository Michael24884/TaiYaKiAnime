import React from "react";
import { ScrollView } from "react-native";
import { Appbar } from "react-native-paper";
import App from "../../App";
import { AuthenticationCards } from "../../Components/authentication_cards";
import { TaiyakiScrollView } from "../../Components/taiyaki_view";
import {
	AnilistClientID,
	AnilistRedirectUri,
} from "../../Models/Taiyaki/models";
import { store } from "../../Util/store";
import { authenticateLink } from "../authenticationBrowser";

const AuthenticationScreen = () => {
	const { anilist, myanimelist } = store.get();

	return (
		<>
			<Appbar.Header>
				<Appbar.Content title={"Trackers"} />
			</Appbar.Header>
			<TaiyakiScrollView>
				<AuthenticationCards
					tracker={"Anilist"}
					username={anilist?.username}
					image={anilist?.avatar}
					signIn={() => {
						authenticateLink({
							tracker: "Anilist",
							authUri: `https://anilist.co/api/v2/oauth/authorize?client_id=${AnilistClientID}&response_type=token`,
							redirectUri: AnilistRedirectUri,
						});
					}}
				/>
				<AuthenticationCards
					tracker={"MyAnimeList"}
					username={myanimelist?.username}
					image={myanimelist?.avatar}
					signIn={() => {}}
				/>
			</TaiyakiScrollView>
		</>
	);
};

export default AuthenticationScreen;
