import { LayoutAnimation } from "react-native";
import { useQuery } from "react-query";

export const useJikanRequest = <T>(key: string, path: string) => {
	const controller = new AbortController();
	const fetcher = () => {
		const baseURL = "https://api.jikan.moe/v4-alpha/anime";
		return fetch(baseURL + path, { signal: controller.signal }).then(
			(response) => response.json() as Promise<T>
		);
	};
	return {
		query: useQuery<T>(key, fetcher, {
			onSettled: () =>
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
			enabled: !path.includes("undefined"),
		}),
		controller: controller,
	};
};
