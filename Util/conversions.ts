import { WatchingStatusList } from "../Models/Taiyaki/models";

export function simklThumbnailCreator(params: string): string {
	return `https://simkl.net/episodes/${params}_w.jpg`;
}

export function MALtoSimkl(malID: number): number {
	return 1;
}

export function cleanString(item: string) {
	return item.replace(/<\w+>|<\/\w+>/g, "");
}

export function breakLine(matchingString: string, matches: string[]): string {
	return "\n";
}
export function italics(_: string, matches: string[]): string {
	return matches[1];
}

export function cleanUnderlines(item: string) {
	return item.replace(/_/, " ");
}

export function getMinutesFromSeconds(seconds: number) {
	const minutes = seconds >= 60 ? Math.floor(seconds / 60) : 0;
	const second = Math.floor(seconds - minutes * 60);
	return `${minutes >= 10 ? minutes : "0" + minutes}:${
		second >= 10 ? second : "0" + second
	}`;
}

export const stringToWatchStatus = new Map<string, WatchingStatusList>([
	["CURRENT", "Watching"],
	["PLANNING", "Planning"],
	["COMPLETED", "Completed"],
	["PAUSED", "Paused"],
	["DROPPED", "Dropped"],
]);
