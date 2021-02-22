import { useRef, useState } from "react";
import { LayoutAnimation } from "react-native";
import { useInfiniteQuery, useQuery } from "react-query";
import { sleep } from "react-query/types/core/utils";

type JikanOptions = {
	keepPreviousData: boolean;
}

export const useJikanRequest = <T>(key: string, path: string, options?: JikanOptions) => {
	const controller = new AbortController();
	const fetcher = () => {
		const baseURL = "https://api.jikan.moe/v4-alpha/anime";
		return fetch(baseURL + path, { signal: controller.signal }).then(
			(response) => response.json() as Promise<T>
		);
	};
	return {
		query: useQuery<T>([key, path], fetcher, {
			onSettled: () =>
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
			enabled: !path.includes("undefined"),
			keepPreviousData: options?.keepPreviousData,
		}),
		controller: controller,
	};
};

interface JikanPages {
	pagination: {
		has_next_page: boolean;
	last_visible_page: number;
	}
}

export const useJikanInifinityRequest = <T extends JikanPages>(key: string, path: string, options?: JikanOptions) => {
	const page = useRef<number>(1);
	const controller = new AbortController();
	const fetcher = () => {
		const baseURL = "https://api.jikan.moe/v4-alpha/anime";
		return fetch(baseURL + path + '?page=' + page.current, { signal: controller.signal }).then(
			(response) => response.json() as Promise<T>
		).finally(() => page.current = page.current + 1);
	};
	return {
		query: useInfiniteQuery<T>(key, fetcher, {
			onSettled: () =>
				LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut),
			enabled: !path.includes("undefined"),
			keepPreviousData: options?.keepPreviousData,
			getFetchMore: (lastPage) => {
				if (lastPage.pagination.has_next_page) {
					return page.current;
				}
			}
		},
		
		),
		controller: controller,
	};
};