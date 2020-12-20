import {EmbededResolvedModel} from '../../Models/taiyaki';
import { unPack } from "./unpacker";
import { HostBase } from "./base";
import { onVisibilityOrOnlineChange } from 'react-query/types/core/queryCache';

export default class StreamX extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		const init = {
			method: 'GET',
			headers: {"referer": "https://anime8.ru/"}
		}
		const html = await (await fetch(embedLink, init)).text();
		const matchGroup = html.match(/sources\: \[([^]*?)\]/m);
		if (matchGroup) {
			if (matchGroup.length >= 2) {
				const sources = JSON.parse('[' + matchGroup[1] + ']').map((source) => {
					return {
						quality: source["label"],
						link: source["file"],
						//headers: {'Referer': 'https://anime8.ru/'}
					};
				});
				return sources
			} else {
				console.log("throwing");
				throw new Error("Error 404: File not found")
			};
		}; 
		throw(new Error('Could not find a proper link'))
};
}
