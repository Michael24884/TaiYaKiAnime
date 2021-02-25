import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";
import cheerio from "react-native-cheerio";

export default class StreamSB extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		var html = await (await fetch(embedLink)).text();
        const reg = /\('(.*?)','(.*?)','(.*?)'\)">.*\d+x(\d+)/
        const matches = html.match(/\('.*?','.*?','.*?'\)">.*\d+x\d+/gm)
        if (!matches) {
            console.log("throwing");
            throw new Error("Error 404: File not found")
        }
        try {
            return await Promise.all(matches.map(async c => {
                const quality = c.match(reg)
                const link = `https://streamsb.net/dl?op=download_orig&id=${quality[1]}&mode=${quality[2]}&hash=${quality[3]}`
                html = await (await fetch(link)).text()
                const $ = cheerio.load(html)
                return {
                    quality: `${quality[4]}p`,
                    link: $('a:contains("Direct Download")').attr('href')
                }
            }))
        } catch (error) {
            throw(new Error('Could not find a proper link'))
        }
};
}
