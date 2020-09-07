import React, { useEffect } from "react";
import { AppNavigator } from "./Components/navigator";
import { default as theme } from "./Util/custom-theme.json";
import { StatusBar, Appearance } from "react-native";
import AsyncStorage, {
	useAsyncStorage,
} from "@react-native-community/async-storage";
import { Bearer, store } from "./Util/store";
import { Trackers } from "./Models/Taiyaki/models";

const App = () => {
	const { getItem } = useAsyncStorage("auth_keys");

	useEffect(() => {
		//AsyncStorage.clear();
		const _obtainKeys = async () => {
			const _keys = await getItem();
			if (_keys) {
				const json = JSON.parse(_keys) as Bearer;
				_assign(json);
			}
		};
		_obtainKeys();
	}, []);

	const _assign = (bearer: Bearer) => {
		const { tracker, bearerToken } = bearer;
		switch (tracker) {
			case "Anilist":
				store.dispatch("update_tokens", { tracker, token: bearerToken });
		}
	};

	return (
		<>
			<StatusBar backgroundColor={"blue"} translucent={false} />
			<AppNavigator />
		</>
	);
};

export default App;
