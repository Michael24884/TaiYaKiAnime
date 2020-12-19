import {EmbededResolvedModel} from '../../Models/taiyaki';
import { unPack } from "./unpacker";
import { HostBase } from "./base";

export default class StreamX extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		const init = {
			method: 'GET',
			headers: {"referer": "https://kisscartoon.nz/"}
		}
		const html = await (await fetch(embedLink, init)).text();
		const matchGroup = html.match(/sources\: \[([^]*?)\]/m);
		if (matchGroup) {
			if (matchGroup.length >= 2) {
				const sources = JSON.parse('[' + matchGroup[1] + ']').map((source) => {
					return {
						quality: source["label"],
						link: source["file"],
					};
				});
				return sources
			} else {
				console.log("throwing");
				throw new Error("Error 404: File not found")
			};
	};
};
