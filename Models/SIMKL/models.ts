export type SimklEpisodes = {
	title?: string;
	episode: number;
	description?: string;
	img: string;
	ids: {
		simkl_id: number;
	};
	embedLink: string;
};

export type SimklIDLookup = {
	ids: {
		simkl: number;
	};
};
