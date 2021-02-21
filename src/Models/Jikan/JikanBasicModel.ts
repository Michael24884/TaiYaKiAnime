type JikanRatingType =
	| "G - All Ages"
	| "PG - Children"
	| "PG-13 - Teens 13 or older"
	| "R - 17+ (violence & profanity)"
	| "R+ - Mild Nudity";

export type JikanDetailModel = {
	data: {
		rating: JikanRatingType;
		studios: JikanStudiosModel[];
		score: number;
		rank: number;
		images: JikanImagesModel[];
	};
};

type JikanImagesModel = {
	jpg: {
		image_url: string;
	};
};

type JikanStudiosModel = {
	mal_id: number;
	name: string;
	url: string;
};

export type JikanEpisodesModel = {
	data: {
		mal_id: number;
		title_romanji: string;
		filler: boolean;
		recap: boolean;
		synopsis: string;
	}[];
};

export const MapJikanRatingTypeToStringObj = new Map<
	JikanRatingType,
	{ rating: string; description: string }
>([
	["G - All Ages", { rating: "G", description: "All Ages" }],
	["PG - Children", { rating: "PG", description: "Children" }],
	[
		"PG-13 - Teens 13 or older",
		{ rating: "PG 13", description: "Teens 13 and older" },
	],
	[
		"R - 17+ (violence & profanity)",
		{ rating: "R 17+", description: "Violence and Profanity" },
	],
	["R+ - Mild Nudity", { rating: "R+", description: "Contains Mild Nudity" }],
]);
