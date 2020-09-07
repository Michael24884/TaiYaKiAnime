export type Trackers = "Anilist" | "MyAnimeList";
export type WatchSource = "Vidstreaming";
export type WatchingStatusList =
	| "Watching"
	| "Planning"
	| "Completed"
	| "Paused"
	| "Dropped";

export type AuthConfig = {
	authUri: string;
	redirectUri: string;
	tracker: Trackers;
};

export type DetailedDatabaseModel = {
	id: number;
	isFollowing: boolean;
	savedLink: string;
	source: WatchSource;
	lastWatchingEpisode: LastWatchingModel;
};

export type LastWatchingModel = {
	episodeTitle: string;
	episodeThumbnail?: string;
	episodeNumber: number;
	embedLink: string;
	progress: number;
};

export type MyListModel = {
	title: string;
	image: string;
	id: number;
	tracker: Trackers;
	score?: number;
	status: WatchingStatusList;
	progress?: number;
	totalEpisodes?: number;
};

export type HistoryModel = {
	title: string;
	image: string;
	id: number;
	source: WatchSource;
};

export type MyQueueModel = {
	title: string;
	thumbnail?: string;
	embedLink: string;
	id: number;
	episodeNumber: number;
	episodeTitle?: string;
};

export const AnilistClientID: string = "2415";
export const AnilistRedirectUri: string = "taiyaki://anilist/redirect";

export const SimklClientID: string =
	"b3392816b2f405397aa0721dc2af589e2ed6f71d333abd6200ae19a56d9bc685";
