import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";
import cheerio from "react-native-cheerio";

export default class BP extends HostBase {
	async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
		const response = await (await fetch(embedLink)).text();
		const $ = cheerio.load(response);
		const d = $("script").get()[2].children[0].data;
		const reg = new RegExp(/file:\s"(.+)"/m);
		const matcher = d.match(reg);
		if (matcher)
			return [{ link: "https://bitporno.com" + matcher[1], quality: "Auto" }];
		else
			throw new Error(
				"Could not match a proper link, or the video does not exist anymore"
			);
	}
}
