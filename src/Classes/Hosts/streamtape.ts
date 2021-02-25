import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";

export default class StreamTape extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		var html = await (await fetch(embedLink)).text();
        const reg = /document\.getElementById\(.*?\)\.innerHTML = [\"'](.*?)[\"'] \+ [\"'](.*?)[\"']/
        const groups = html.match(reg)
        if (!groups) {
            console.log("throwing");
            throw new Error("Error 404: File not found")
        }
        try {
           return {
               quality: 'Auto',
               link: `https:${groups[1]}${groups[2]}`
            }
        } catch (error) {
            throw(new Error('Could not find a proper link'))
        }
};
}
