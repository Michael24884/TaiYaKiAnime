import { StoreonModule, createStoreon } from "storeon";
import { AnilistUserProfile } from "../Models/Anilist/basic_models";
import { SimklEpisodes } from "../Models/SIMKL/models";
import { MyQueueModel, Trackers } from "../Models/Taiyaki/models";
import { useAnilistSWR } from "./hooks";
import { customContext } from "storeon/react";
import { createContext } from "react";

export type Bearer = {
	tracker: Trackers;
	bearerToken: string;
	username?: string;
	avatar?: string;
	userID: number;
};
interface AuthState {
	anilist: Bearer;
	myanimelist: Bearer;
}

interface AuthEvents {
	update_tokens: { token: string; tracker: Trackers };
	update_profile: { token: string; tracker: Trackers };
	place_profiles: Bearer;
}

const authmodule: StoreonModule<AuthState, AuthEvents> = (store) => {
	store.on("update_tokens", (state, events) => {
		const { token, tracker } = events;

		switch (tracker) {
			case "Anilist":
				store.dispatch("update_profile", { token, tracker });
				return { ...state, anilist: { ...state.anilist, bearerToken: token } };
			case "MyAnimeList":
				return {
					...state,
					myanimelist: { ...state.myanimelist, bearerToken: token },
				};
			default:
				throw new Error("That tracker does not exist.");
		}
	});

	store.on("place_profiles", (state, event) => {
		const { tracker, username, avatar, userID } = event;
		switch (tracker) {
			case "Anilist":
				return {
					...state,
					anilist: { ...state.anilist, username, avatar, userID },
				};
		}
	});

	store.on("update_profile", async (_, event) => {
		const { tracker, token } = event;
		try {
			switch (tracker) {
				case "Anilist":
					const _response = await fetch("https://graphql.anilist.co", {
						method: "POST",
						body: JSON.stringify({
							query: "query{Viewer{id name avatar{large}}}",
						}),
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer " + token,
						},
					});
					const json = (await _response.json()) as AnilistUserProfile;

					store.dispatch("place_profiles", {
						bearerToken: token,
						avatar: json.data.Viewer.avatar.large,
						username: json.data.Viewer.name,
						userID: json.data.Viewer.id,
						tracker: "Anilist",
					});
				// return {
				// 	...state,
				// 	anilist: {
				// 		...state.anilist,
				// 		username: anilistProfile?.data.Viewer.name,
				// 		avatar: anilistProfile?.data.Viewer.avatar.large,
				// 	},
				// };
				case "MyAnimeList":
				//return { ...state };
			}
		} catch (e) {
			//	return state;
		}
	});
};

export type MyQueueItems = {
	[key: string]: MyQueueModel[];
};

interface QueueState {
	myQueue: MyQueueItems;
	// myQueue: {
	// 	id: number;
	// 	data: MyQueueModel[];
	// }[];
	// hasItem: boolean;
}

interface QueueEvents {
	addToQueue: { key: string; data: MyQueueModel };
	emptyList: undefined;
}

const queueModule: StoreonModule<QueueState, QueueEvents> = (store) => {
	store.on("@init", (state) => ({ ...state, myQueue: {} }));
	store.on("emptyList", (state) => ({ ...state, myQueue: {} }));

	store.on("addToQueue", (state, event) => {
		const { myQueue } = state;
		const { key, data } = event;

		function _checkInList(): boolean {
			console.log("check");
			if (Object.keys(myQueue).length === 0) return false;
			if (myQueue?.hasOwnProperty(key) ?? false) {
				for (var i = 0; i < myQueue[key].length; i++) {
					if (myQueue[key][i].episodeNumber == data.episodeNumber) {
						console.log("matched");
						return true;
					}
				}
			}
			return false;
		}

		if (myQueue?.hasOwnProperty(key) ?? false) {
			if (_checkInList()) {
				const d: MyQueueModel = myQueue[key].filter(
					(i) => i.episodeNumber == data.episodeNumber
				)[0];
				myQueue[key].splice(myQueue[key].indexOf(d), 1);
				if (myQueue[key].length == 0) {
					delete myQueue[key];
				}
				return { ...state, myQueue };
			} else {
				myQueue[key].push(data);
				return { ...state, myQueue };
			}
		} else {
			myQueue[key] = [data];
			console.log(myQueue);
			return { ...state, myQueue };
		}
	});
};

export const queueStore = createStoreon<QueueState, QueueEvents>([queueModule]);
const context = createContext(queueStore);
export const dynamicQueueStore = customContext(context);

export const store = createStoreon<AuthState, AuthEvents>([authmodule]);
