import React, { useEffect, useState } from "react";
import useSwr, { responseInterface } from "swr";
import { SimklClientID } from "../Models/Taiyaki/models";
import { store } from "./store";

type Pref = "AFTER_INITIAL_DOWNLOAD";

export function useAnilistSWR<T>(
	query: string,
	key?: string,
	condition: boolean | Pref = true
): {
	swr: responseInterface<T, any>;
	controller: AbortController;
} {
	const [data, setData] = useState<any>();

	const controller = new AbortController();
	const { signal } = controller;
	const API = "https://graphql.anilist.co";
	const fetcher = (url: string): Promise<T> =>
		fetch(url, {
			signal,
			method: "POST",
			body: JSON.stringify({ query: query }),
			headers: store.get()?.anilist?.bearerToken
				? {
						"Authorization": "Bearer " + store.get().anilist.bearerToken,
						"Content-Type": "application/json",
				  }
				: {
						"Content-Type": "application/json",
				  },
		})
			.then((data) => {
				setData(data);
				return data.json();
			})
			.catch((error) => {
				console.log(`[Taiyaki Error: ${error.toString()} ]`);
			});

	if (condition === "AFTER_INITIAL_DOWNLOAD") {
		return {
			swr: useSwr<T>(!data ? [API, key] : null, fetcher, {
				revalidateOnReconnect: true,
				//Download new data every hour or on user preference
				refreshInterval: 3600000,
			}),
			controller,
		};
	}

	return {
		swr: useSwr<T>(condition ? [API, key] : null, fetcher, {
			revalidateOnReconnect: true,
			//Download new data every hour or on user preference
			refreshInterval: 3600000,
		}),
		controller,
	};
}

export function useSimklSWR<T>(
	url: string,
	key?: string
): {
	swr: responseInterface<T, any>;
	controller: AbortController;
} {
	const controller = new AbortController();
	const { signal } = controller;
	const API = "https://api.simkl.com" + url;
	const fetcher = (url: string): Promise<T> =>
		fetch(url, {
			signal,
			headers: {
				"simkl-api-key": SimklClientID,
				"Content-Type": "application/json",
			},
		})
			.then((data) => data.json())
			.catch((error) => {
				console.log(`[Taiyaki Error: ${error.toString()} ]`);
			});

	return {
		swr: useSwr<T>([API, key], fetcher),
		controller,
	};
}
