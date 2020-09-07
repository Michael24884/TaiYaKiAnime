export type AnilistBasicModel = {
	title: {
		english: string;
		romaji?: string;
	};
	coverImage: {
		extraLarge: string;
	};
	id: number;
	bannerImage?: string;
	idMal: string;
};

export type AnilistDetailedModel = {
	title: {
		english: string;
		romaji?: string;
	};
	coverImage: {
		extraLarge: string;
	};
	nextAiringEpisode: {
		episode: number;
		timeUntilAiring: number;
	};
	id: number;
	bannerImage?: string;
	source?: string;
	genres: string[];
	description?: string;
	idMal: string;
	trending: number;
	status: string;
	format?: string;
	season?: string;
	seasonYear?: number;
	episodes?: number;
	countryOfOrigin?: string;
	duration?: number;
	startDate: {
		month: number;
		day: number;
		year: number;
	};
	endDate: {
		month: number;
		day: number;
		year: number;
	};
	tags: {
		name: string;
		rank: number;
		description: string;
	}[];
	recommendations: {
		nodes: {
			mediaRecommendation: {
				title: {
					english: string;
					romaji?: string;
				};
				coverImage: {
					extraLarge: string;
				};
				id: number;
				idMal: string;
			};
		}[];
	};
};

type AnilistPageInfo = {
	hasNextPage: boolean;
	currentPage: number;
};

export type AnilistCharacters = {
	data: {
		Media: {
			characters: {
				pageInfo: AnilistPageInfo;
				edges: {
					role: string;
					node: AnilistBasicCharacters;
				}[];
			};
		};
	};
};

export type AnilistBasicCharacters = {
	name: {
		first: string;
		last: string;
		full: string;
		native: string;
	};
	image: {
		large: string;
	};
	description: string;
	id: number;
};

export type AnilistUserProfile = {
	data: {
		Viewer: {
			id: number;
			name: string;
			avatar: {
				large: string;
			};
		};
	};
};

export type AnilistRecommendations = {
	data: {
		Media: {
			relations: {
				edges: AnilistRecEdge[];
			};
		};
	};
};

export type AnilistRecEdge = {
	relationType: string;
	node: {
		type: string;
		title: {
			romaji: string;
		};
		coverImage: {
			extraLarge: string;
		};
		id: number;
	};
};

export type AnilistUserListBase = {
	data: {
		MediaListCollection: {
			lists: AnilistUserList[];
		};
	};
};

export type AnilistUserList = {
	entries: AnilistEntriesList[];
};

export type AnilistEntriesList = {
	status: string;
	score?: number;
	progress: number;

	media: {
		episodes: number;
		id: number;
		title: {
			romaji: string;
		};
		coverImage: {
			extraLarge: string;
		};
	};
};
